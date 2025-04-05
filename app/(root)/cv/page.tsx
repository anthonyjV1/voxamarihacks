'use client';

import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function CVUploadPage() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [enhancedCV, setEnhancedCV] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError(fileRejections[0].errors[0].message);
        return;
      }

      if (acceptedFiles.length === 0) return;

      setError(null);
      setIsProcessing(true);
      setSuccess(false);
      setEnhancedCV('');

      try {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        const response = await fetch('/api/cv/enhance', {
          method: 'POST',
          body: formData,
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(text || 'Invalid server response');
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process CV');
        }

        if (!data.enhancedCV) {
          throw new Error('No enhanced CV returned from server');
        }

        setEnhancedCV(data.enhancedCV);
        setSuccess(true);

      } catch (err) {
        console.error('CV processing error:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'An unknown error occurred'
        );
      } finally {
        setIsProcessing(false);
      }
    }
  });

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">CV Enhancement with AI</h1>
      <p className="text-gray-600 text-center mb-8">
        Upload your CV and we&apos;ll use Gemini AI to improve it with better wording, formatting, and suggestions.
      </p>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all mb-8 ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-lg mb-2">
          {isDragActive 
            ? 'Drop your CV file here' 
            : 'Drag & drop your CV file here, or click to select'}
        </p>
        <p className="text-sm text-gray-500">Supported formats: PDF</p>
      </div>

      {isProcessing && (
        <div className="bg-orange-100 text-orange-800 p-6 rounded-lg mb-8 text-center">
          <p className="font-medium">Enhancing Your CV...</p>
          <p>This may take a moment.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-6 rounded-lg mb-8 text-center">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {success && enhancedCV && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Enhanced CV:</h2>
          <div 
            className="bg-white border border-gray-200 rounded-md p-4 mb-4 overflow-auto max-h-[500px]" 
            dangerouslySetInnerHTML={{ __html: enhancedCV }} 
          />
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigator.clipboard.writeText(enhancedCV)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Copy to Clipboard
            </button>
            <button 
              onClick={() => {
                const blob = new Blob([enhancedCV], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'enhanced-cv.html';
                a.click();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Download as HTML
            </button>
          </div>
        </div>
      )}
    </div>
  );
}