import React from 'react';
import { FileType } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
  onProcess: () => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileChange, file, onProcess, isProcessing }: FileUploadProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <FileType className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-neutral-800">Upload Document</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="flex flex-col items-center justify-center h-40 border-2 border-indigo-100 border-dashed rounded-lg cursor-pointer bg-white/50 hover:bg-indigo-50/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileType className="w-10 h-10 mb-3 text-indigo-500" />
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only (max. 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />
        </label>
        {file && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 bg-indigo-50 p-2 rounded-lg">
              Selected: {file.name}
            </div>
            <button
              onClick={onProcess}
              disabled={isProcessing}
              className="w-full px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                'Process PDF'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}