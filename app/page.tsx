'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browserClient'

export default function Home() {
  const [supabase, setSupabase] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient()
    setSupabase(client)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-primary text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">PrintVerse Technologies</h1>
          <p className="text-gold">Where Every Idea Takes Shape</p>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">Welcome to PrintVerse</h2>
          <p className="text-gray-700">
            We're building the future of 3D printing with innovative solutions for creators and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-primary mb-2">Design System</h3>
            <p className="text-gray-700">
              Implemented with Tailwind CSS using our brand colors:
              <span className="text-primary"> Deep Navy Blue</span>,
              <span className="text-accent"> Red</span>, and
              <span className="text-gold"> Gold</span>.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-primary mb-2">Database Schema</h3>
            <p className="text-gray-700">
              Orders table with tracking, status management, and STL file uploads.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-primary mb-2">Supabase Integration</h3>
            <p className="text-gray-700">
              Server and browser clients configured for seamless database access.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 p-6 mt-12">
        <div className="container mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} PrintVerse Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}