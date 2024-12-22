import React, { useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { FileUpload } from './components/FileUpload';
import { ProcessUrl } from './components/ProcessUrl';
import { ChatInterface } from './components/ChatInterface';
import { MessageList } from './components/MessageList';

function App() {
  const [url, setUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [chatId, setChatId] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processUrl = async () => {
    if (!url.trim()) return;
    
    setIsProcessing(true);
    try {
      const res = await axios.post('http://localhost:8000/process_url', { url });
      setChatId(res.data.chat_id);
      setMessages(prev => [...prev, res.data.message]);
      setUrl('');
    } catch (error: any) {
      alert('Error processing URL: ' + error.response?.data?.detail || error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPdf = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const res = await axios.post('http://localhost:8000/process_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setChatId(res.data.chat_id);
      setMessages(prev => [...prev, res.data.message]);
      setPdfFile(null);
    } catch (error: any) {
      alert('Error processing PDF: ' + error.response?.data?.detail || error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendChat = async () => {
    if (!chatId || !question.trim()) return;

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        chat_id: chatId,
        question: question.trim(),
      });
      setMessages(prev => [...prev, `Q: ${question}`, `A: ${res.data.response}`]);
      setQuestion('');
    } catch (error: any) {
      alert('Error sending chat: ' + error.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Header />
        
        <div className="space-y-6">
          <Card>
            <ProcessUrl
              url={url}
              onUrlChange={setUrl}
              onProcess={processUrl}
            />
          </Card>

          <Card>
            <FileUpload onFileChange={setPdfFile} />
            {pdfFile && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Selected: {pdfFile.name}
                </span>
                <button
                  onClick={processPdf}
                  disabled={isProcessing}
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Process PDF
                </button>
              </div>
            )}
          </Card>

          <Card>
            <ChatInterface
              question={question}
              onQuestionChange={setQuestion}
              onSend={sendChat}
              disabled={!chatId}
            />
            {chatId && (
              <div className="mt-4 text-sm text-gray-500">
                Session ID: {chatId}
              </div>
            )}
          </Card>

          <Card>
            <MessageList messages={messages} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;