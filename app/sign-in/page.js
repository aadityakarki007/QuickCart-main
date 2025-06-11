import { SignIn } from '@clerk/nextjs'
import React from 'react';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
              card: 'shadow-lg',
            }
          }}
          redirectUrl={'/'}  // Redirect to home after sign in
          fallbackRedirectUrl={'/'}  // Fallback if no redirect_url in params
        />
      </div>
    </div>
  )
}