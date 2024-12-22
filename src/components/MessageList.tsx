import React from 'react';
import { MessageCircle, Bot, User } from 'lucide-react';

interface Message {
  type: 'question' | 'answer';
  content: string;
}

interface MessageListProps {
  messages: string[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) return null;

  const parseMessages = (messages: string[]): Message[] => {
    return messages.map(msg => {
      if (msg.startsWith('Q: ')) {
        return { type: 'question', content: msg.slice(3) };
      } else if (msg.startsWith('A: ')) {
        return { type: 'answer', content: msg.slice(3) };
      }
      return { type: 'answer', content: msg };
    });
  };

  const parsedMessages = parseMessages(messages);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Conversation History</h3>
      </div>
      <div className="space-y-4">
        {parsedMessages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              msg.type === 'question' 
                ? 'bg-blue-50 border border-blue-100 ml-8' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {msg.type === 'question' ? (
                <User className="w-5 h-5 mt-1 text-blue-600" />
              ) : (
                <Bot className="w-5 h-5 mt-1 text-blue-600" />
              )}
              <p className="text-gray-700 leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}