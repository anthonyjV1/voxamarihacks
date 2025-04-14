import React from 'react'
import AuthForm from '@/components/AuthForm'
import FuturisticBackground from '@/components/FuturisticBackground'
const page = () => {
  return (
    <div>
      {/* Neural background */}
      <FuturisticBackground />

      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div>
          </div>
          
          
          <AuthForm type="sign-in" />
          
        </div>
      </div>
  )
}

export default page