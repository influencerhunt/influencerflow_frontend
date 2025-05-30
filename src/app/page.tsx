import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-blue-600">InfluencerFlow</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect influencers with brands through our powerful platform with 
            role-based authentication and seamless collaboration tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Features for Every Role
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Users</h3>
              <p className="text-gray-600">
                Basic platform access with personalized dashboard
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Influencers</h3>
              <p className="text-gray-600">
                Showcase your content and connect with brands
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brands</h3>
              <p className="text-gray-600">
                Find and collaborate with the right influencers
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admins</h3>
              <p className="text-gray-600">
                Full platform control and user management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 InfluencerFlow. Built with FastAPI and Next.js.
          </p>
        </div>
      </footer>
    </div>
  )
}
