import { useState } from 'react'
import Link from 'next/link'

type UserRole = 'influencer' | 'brand' | 'user'

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void
  isLoading?: boolean
  title?: string
  subtitle?: string
  showBackToLogin?: boolean
}

export function RoleSelection({ 
  onRoleSelect, 
  isLoading = false, 
  title = "Join InfluencerFlow",
  subtitle = "Choose your account type to get started",
  showBackToLogin = true
}: RoleSelectionProps) {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500">
          {subtitle}
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Creator/Influencer Option */}
        <div 
          onClick={() => !isLoading && onRoleSelect('influencer')}
          className={`cursor-pointer p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">
                I'm a Creator
              </h3>
              <p className="text-gray-600 mt-1">
                Content creator, influencer, or artist looking to collaborate with brands and monetize your content.
              </p>
              <ul className="mt-3 text-sm text-gray-500 space-y-1">
                <li>• Connect with brands</li>
                <li>• Manage collaborations</li>
                <li>• Track performance</li>
                <li>• Get paid for content</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Brand Option */}
        <div 
          onClick={() => !isLoading && onRoleSelect('brand')}
          className={`cursor-pointer p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                I'm a Brand
              </h3>
              <p className="text-gray-600 mt-1">
                Business, company, or organization looking to collaborate with creators for marketing campaigns.
              </p>
              <ul className="mt-3 text-sm text-gray-500 space-y-1">
                <li>• Find the right creators</li>
                <li>• Launch campaigns</li>
                <li>• Measure ROI</li>
                <li>• Manage partnerships</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Just Browsing Option */}
        <div 
          onClick={() => !isLoading && onRoleSelect('user')}
          className={`cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="text-center">
            <h3 className="text-md font-medium text-gray-700">
              Just browsing for now
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Explore the platform and upgrade later
            </p>
          </div>
        </div>
      </div>
      
      {showBackToLogin && (
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </Link>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Setting up your account...</span>
          </div>
        </div>
      )}
    </div>
  )
} 