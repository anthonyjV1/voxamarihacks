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
    <div className="container">
      <h1>CV Enhancement with AI</h1>
      <p className="description">
        Upload your CV and we&apos;ll use Gemini AI to improve it with better wording, formatting, and suggestions.
      </p>
      
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>
          {isDragActive 
            ? 'Drop your CV file here' 
            : 'Drag & drop your CV file here, or click to select'}
        </p>
        <p className="file-types">Supported formats: PDF, DOC, DOCX, TXT</p>
      </div>

      {isProcessing && (
        <div className="status processing">
          <p>Analyzing your CV with Gemini AI...</p>
          <p>This may take a moment.</p>
        </div>
      )}

      {error && (
        <div className="status error">
          <p>Error: {error}</p>
        </div>
      )}

      {success && enhancedCV && (
        <div className="result">
          <h2>Enhanced CV:</h2>
          <div className="enhanced-cv" dangerouslySetInnerHTML={{ __html: enhancedCV }} />
          <div className="actions">
            <button onClick={() => navigator.clipboard.writeText(enhancedCV)}>
              Copy to Clipboard
            </button>
            <button onClick={() => {
              const blob = new Blob([enhancedCV], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'enhanced-cv.html';
              a.click();
            }}>
              Download as HTML
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
        }
        h1 {
          text-align: center;
          margin-bottom: 1rem;
        }
        .description {
          text-align: center;
          color: #64748b;
          margin-bottom: 2rem;
        }
        .dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 2rem;
        }
        .dropzone.active {
          border-color: #6366f1;
          background-color: #eef2ff;
        }
        .file-types {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
        }
        .status {
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: center;
        }
        .processing {
          background-color: #ffedd5;
          color: #9a3412;
        }
        .error {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .result {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .enhanced-cv {
          margin: 1rem 0;
          padding: 1rem;
          background: white;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #4f46e5;
        }
      `}</style>
    </div>
  );
}