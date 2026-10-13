import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Leaf className="h-16 w-16 text-green-300 mb-4" />
      <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-green-700 hover:bg-green-800">
        <Link to="/">Go to Homepage</Link>
      </Button>
    </div>
  )
}
