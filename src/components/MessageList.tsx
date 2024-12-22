import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Bot, User, Sparkles, ChevronDown } from 'lucide-react';

interface Message {
  type: 'question' | 'answer';
  content: string;
  id: string;
}

interface MessageListProps {
  messages: string[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="relative mb-4">
          <Bot className="w-12 h-12 text-indigo-400" />
          <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-purple-400" />
        </div>
        <p>Upload a document or provide a URL to start chatting</p>
      </div>
    );
  }

  const parseMessages = (messages: string[]): Message[] => {
    return messages.map((msg, index) => {
      const id = `msg-${index}-${Date.now()}`;
      if (msg.startsWith('Q: ')) {
        return { type: 'question', content: msg.slice(3), id };
      } else if (msg.startsWith('A: ')) {
        return { type: 'answer', content: msg.slice(3), id };
      }
      return { type: 'answer', content: msg, id };
    });
  };

  const parsedMessages = parseMessages(messages);

  return (
    <div className="relative h-full">
      <div 
        ref={containerRef}
        className="space-y-4 overflow-y-auto pr-4 max-h-[calc(100vh-20rem)] md:max-h-[calc(100vh-16rem)] custom-scrollbar"
      >
        {parsedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg transition-all ${
              msg.type === 'question' 
                ? 'bg-indigo-50 border border-indigo-100 ml-4 md:ml-8' 
                : 'bg-white border border-purple-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {msg.type === 'question' ? (
                <User className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" />
              ) : (
                <div className="relative flex-shrink-0">
                  <Bot className="w-5 h-5 mt-1 text-purple-600" />
                  <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-400" />
                </div>
              )}
              <p className="text-gray-700 leading-relaxed break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-0 right-4 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}