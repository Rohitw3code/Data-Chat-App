import React from 'react';
import { Upload, FileType } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export function FileUpload({ onFileChange }: FileUploadProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <FileType className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
      </div>
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-100 border-dashed rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 mb-3 text-blue-500" />
          <p className="mb-2 text-sm text-gray-500">
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
    </div>
  );
}