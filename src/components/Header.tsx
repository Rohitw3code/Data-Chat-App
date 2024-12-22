import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-10 h-10" />
              <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Hygwell AI</h1>
              <p className="text-sm text-indigo-100">Intelligent Document Analysis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-indigo-50 text-sm">AI System Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}