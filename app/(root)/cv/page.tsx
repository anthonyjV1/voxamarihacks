'use client';

import React from 'react';
import CVUploadPage from './upload-component';
import FuturisticBackground from '@/components/FuturisticBackground';

export default function CVPage() {
  return (
    <div className="relative min-h-screen">
      <FuturisticBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto max-w-3xl px-4 py-8">
          <div className="backdrop-blur-lg bg-white/30 dark:bg-black/30 rounded-xl p-6 shadow-xl">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-white">
              AI-Powered CV Enhancement
            </h1>
            
            <p className="text-lg text-center mb-8 text-gray-700 dark:text-gray-200">
              Upload your CV and let our AI transform it into a professional masterpiece.
            </p>
            
            <CVUploadPage />
          </div>
        </div>
      </div>
    </div>
  );
}