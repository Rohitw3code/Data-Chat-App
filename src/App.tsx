import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { FileUpload } from './components/FileUpload';
import { ProcessUrl } from './components/ProcessUrl';
import { ChatInterface } from './components/ChatInterface';
import { MessageList } from './components/MessageList';
import { documentApi } from './api/client';

export function App() {
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
      const { chat_id, message } = await documentApi.processUrl(url);
      setChatId(chat_id);
      setMessages(prev => [...prev, message]);
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
      const { chat_id, message } = await documentApi.processPdf(pdfFile);
      setChatId(chat_id);
      setMessages(prev => [...prev, message]);
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
      const { response } = await documentApi.chat(chatId, question.trim());
      setMessages(prev => [...prev, `Q: ${question}`, `A: ${response}`]);
      setQuestion('');
    } catch (error: any) {
      alert('Error sending chat: ' + error.response?.data?.detail || error.message);
    }
  };

  return (
    <Layout>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Document Processing */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm">
              <ProcessUrl
                url={url}
                onUrlChange={setUrl}
                onProcess={processUrl}
                isProcessing={isProcessing}
              />
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <FileUpload 
                onFileChange={setPdfFile}
                file={pdfFile}
                onProcess={processPdf}
                isProcessing={isProcessing}
              />
            </Card>
          </div>

          {/* Right side - Chat Interface */}
          <div className="w-full lg:w-2/3">
            <Card className="h-[600px] lg:h-[calc(100vh-12rem)] bg-white/50 backdrop-blur-sm relative" noPadding>
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-grow overflow-y-auto p-6">
                  <div className="max-w-3xl mx-auto">
                    <MessageList messages={messages} />
                  </div>
                </div>
                <ChatInterface
                  question={question}
                  onQuestionChange={setQuestion}
                  onSend={sendChat}
                  disabled={!chatId}
                />
                {chatId && (
                  <div className="px-6 pb-2 text-xs text-gray-400 text-center">
                    Session ID: {chatId}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;