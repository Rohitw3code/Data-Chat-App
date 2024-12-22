import React from 'react';
import { Globe } from 'lucide-react';

interface ProcessUrlProps {
  url: string;
  onUrlChange: (url: string) => void;
  onProcess: () => void;
}

export function ProcessUrl({ url, onUrlChange, onProcess }: ProcessUrlProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Process Web URL</h2>
      </div>
      <div className="flex gap-3">
        <input
          type="url"
          placeholder="Enter a webpage URL to analyze..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={onProcess}
          disabled={!url}
          className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Process
        </button>
      </div>
    </div>
  );
}