from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from bs4 import BeautifulSoup
from PyPDF2 import PdfReader
import os
import uuid
import requests
from pathlib import Path
from flask_cors import CORS
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

data_store = {}

# Langchain setup
embeddings = OpenAIEmbeddings()
vector_store = None
qa_chain = None
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

@app.route("/process_url", methods=["POST"])
def process_url():
    # try:
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

    # Create documents for the scraped content
    documents = [{"page_content": content, "metadata": {"source": url}}]
    global vector_store
    vector_store = FAISS.from_documents(documents, embeddings)

    global qa_chain
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vector_store.as_retriever())

    return jsonify({
        "chat_id": chat_id,
        "message": "URL content processed and stored successfully."
    })
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

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

        # Use Langchain to load and process the PDF
        loader = PyPDFLoader(str(file_path))
        documents = loader.load()

        # Create FAISS index for retrieval
        global vector_store
        vector_store = FAISS.from_documents(documents, embeddings)

        # Create RetrievalQA Chain
        global qa_chain
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vector_store.as_retriever())

        # Remove the temporary file
        file_path.unlink()

        # Generate a unique chat_id
        chat_id = str(uuid.uuid4())
        data_store[chat_id] = "PDF content processed and stored successfully."

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

        # Check if content is available in the store
        content = data_store.get(chat_id)
        if not content:
            return jsonify({"error": "chat_id not found."}), 404

        if vector_store and qa_chain:
            # Use the RetrievalQA chain to get the response
            response = qa_chain.run(question)
            return jsonify({"response": response})

        return jsonify({"error": "No vector store or QA chain available."}), 500
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
