import AuthForm from '@/components/AuthForm'
import NeuralBackground from '@/components/NeuralBackground';
import React from 'react'

const page = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
      {/* Neural background */}
      <NeuralBackground />

      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-md px-6 py-8 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-indigo-500/20 shadow-xl">
          </div>
          
          
          <AuthForm type="sign-up" />
          
        </div>
      </div>
  );
}

export default page