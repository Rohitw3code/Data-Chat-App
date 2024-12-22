import React from 'react';
import { Brain } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Brain className="w-12 h-12 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">
          Document AI Assistant
        </h1>
      </div>
      <p className="text-lg text-gray-600">
        Chat with your documents using advanced AI - Upload a PDF or provide a URL to get started
      </p>
    </div>
  );
}