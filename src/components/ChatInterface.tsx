import React, { KeyboardEvent } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface ChatInterfaceProps {
  question: string;
  onQuestionChange: (question: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInterface({ 
  question, 
  onQuestionChange, 
  onSend,
  disabled 
}: ChatInterfaceProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && question.trim()) {
      onSend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Chat with Your Document</h2>
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={disabled ? "Process a document first to start chatting..." : "Ask any question about your document..."}
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        />
        <button
          onClick={onSend}
          disabled={disabled || !question.trim()}
          className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  );
}