import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white',
              card: 'shadow-lg',
              headerTitle: 'text-2xl font-bold text-gray-800',
              headerSubtitle: 'text-gray-600',
            }
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  )
}