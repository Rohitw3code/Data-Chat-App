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
    <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-neutral-800">Chat with Your Document</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={disabled ? "Process a document first to start chatting..." : "Ask any question about your document..."}
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1 px-4 py-2.5 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors bg-white/90"
          />
          <button
            onClick={onSend}
            disabled={disabled || !question.trim()}
            className="px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}