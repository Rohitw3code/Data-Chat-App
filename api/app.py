from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from sentence_transformers import SentenceTransformer, util
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader
import os
import uuid
import requests
from pathlib import Path
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

data_store = {}

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route("/process_url", methods=["POST"])
def process_url():
    try:
        data = request.get_json()
        url = data.get("url")
        if not url:
            return jsonify({"error": "URL is required."}), 400

        # Scrape the content from the URL
        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({"error": "Unable to fetch the URL."}), 400

        soup = BeautifulSoup(response.text, "html.parser")
        content = soup.get_text(separator="\n").strip()

        # Generate a unique chat_id and store the content
        chat_id = str(uuid.uuid4())
        data_store[chat_id] = content

        return jsonify({
            "chat_id": chat_id,
            "message": "URL content processed and stored successfully."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/process_pdf", methods=["POST"])
def process_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part."}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file."}), 400

        # Save the uploaded PDF locally
        filename = secure_filename(file.filename)
        file_path = Path(f"./temp_{filename}")
        file.save(file_path)

        # Extract text from the PDF
        pdf_reader = PdfReader(str(file_path))
        content = "\n".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())

        # Remove the temporary file
        file_path.unlink()

        # Generate a unique chat_id and store the content
        chat_id = str(uuid.uuid4())
        data_store[chat_id] = content.strip()

        return jsonify({
            "chat_id": chat_id,
            "message": "PDF content processed and stored successfully."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        chat_id = data.get("chat_id")
        question = data.get("question")
        if not chat_id or not question:
            return jsonify({"error": "chat_id and question are required."}), 400

        # Fetch the stored content by chat_id
        content = data_store.get(chat_id)
        if not content:
            return jsonify({"error": "chat_id not found."}), 404

        # Split content into chunks (e.g., sentences)
        chunks = content.split("\n")
        chunk_embeddings = embedding_model.encode(chunks, convert_to_tensor=True)

        # Generate embeddings for the question
        question_embedding = embedding_model.encode(question, convert_to_tensor=True)

        # Compute similarity scores
        similarities = util.pytorch_cos_sim(question_embedding, chunk_embeddings)[0]
        top_score, top_idx = similarities.max(), similarities.argmax()

        print("top score : ",top_score)

        # Return the most relevant chunk if similarity is above a threshold
        if top_score > 0.2:
            response_text = chunks[top_idx]
        else:
            response_text = "No relevant answer found."

        return jsonify({"response": response_text, "similarity": top_score.item()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/clear_data", methods=["DELETE"])
def clear_data():
    try:
        data_store.clear()
        return jsonify({"message": "All stored data has been cleared."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_content/<chat_id>", methods=["GET"])
def get_content(chat_id):
    try:
        content = data_store.get(chat_id)
        if not content:
            return jsonify({"error": "chat_id not found."}), 404

        return jsonify({"chat_id": chat_id, "content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)
