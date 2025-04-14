import AuthForm from '@/components/AuthForm'
import FuturisticBackground from '@/components/FuturisticBackground';
import React from 'react'

const page = () => {
  return (
    <div>
      {/* Neural background */}
      <FuturisticBackground/>

      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div>
          </div>
          
          
          <AuthForm type="sign-up" />
          
        </div>
      </div>
  );
}

export default page