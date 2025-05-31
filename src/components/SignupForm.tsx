'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { RoleSelection } from '@/components/RoleSelection'
import Link from 'next/link'

type UserRole = 'influencer' | 'brand' | 'user'

export function SignupForm() {
  const [step, setStep] = useState<'role' | 'details'>('role')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: '' as UserRole | ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signup } = useAuth()
  const router = useRouter()

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }))
    setStep('details')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signup(formData as Required<typeof formData>)
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleBack = () => {
    setStep('role')
    setError('')
  }

  if (step === 'role') {
    return (
      <RoleSelection 
        onRoleSelect={handleRoleSelect}
        isLoading={isLoading}
      />
    )
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <button 
          onClick={handleBack}
          className="text-gray-400 hover:text-gray-600 mb-2"
        >
          ← Back to role selection
        </button>
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-gray-500">
          {formData.role === 'influencer' ? '🎨 Setting up your creator account' :
           formData.role === 'brand' ? '🏢 Setting up your brand account' :
           '👤 Setting up your account'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Full Name {formData.role === 'brand' ? '(or Company Name)' : ''}
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={formData.role === 'brand' ? 'Your Company Name' : 'Your Full Name'}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Create a strong password"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>

        {/* Role confirmation */}
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              formData.role === 'influencer' ? 'bg-purple-500' :
              formData.role === 'brand' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              Account type: <span className="font-medium capitalize">
                {formData.role === 'influencer' ? 'Creator/Influencer' : 
                 formData.role === 'brand' ? 'Brand/Business' : 'User'}
              </span>
            </span>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
          Sign in
        </Link>
      </div>
    </div>
  )
} 