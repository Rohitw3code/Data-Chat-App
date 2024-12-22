import React from 'react';
import { Globe } from 'lucide-react';

interface ProcessUrlProps {
  url: string;
  onUrlChange: (url: string) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function ProcessUrl({ url, onUrlChange, onProcess, isProcessing }: ProcessUrlProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-neutral-800">Process Web URL</h2>
      </div>
      <div className="space-y-3">
        <input
          type="url"
          placeholder="Enter a webpage URL to analyze..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80"
        />
        <button
          onClick={onProcess}
          disabled={!url || isProcessing}
          className="w-full px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin">⏳</span>
              Processing...
            </>
          ) : (
            'Process URL'
          )}
        </button>
      </div>
    </div>
  );
}