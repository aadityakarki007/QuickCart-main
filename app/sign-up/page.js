import { SignUp } from '@clerk/nextjs'
import React from 'react';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case'
          }
        }}
      />
    </div>
  )
}