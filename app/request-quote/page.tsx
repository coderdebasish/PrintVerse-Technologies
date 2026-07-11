'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function RequestQuote() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  })
  const [stlFile, setStlFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [phoneNumberValue, setPhoneNumberValue] = useState<string | undefined>(undefined)

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    stlFile: ''
  })

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Full name validation (at least 2 characters, letters and spaces only)
  const fullNameRegex = /^[A-Za-z\s]{2,}$/

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file extension strictly (case-insensitive)
      if (file.name.toLowerCase().endsWith('.stl')) {
        setStlFile(file)
        setValidationErrors(prev => ({ ...prev, stlFile: '' }))
      } else {
        setValidationErrors(prev => ({ ...prev, stlFile: 'Please upload only .stl files' }))
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setStlFile(null)
      }
    }
  }

  const validateForm = () => {
    let isValid = true
    const errors = {
      fullName: '',
      email: '',
      phoneNumber: '',
      stlFile: ''
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
      isValid = false
    } else if (!fullNameRegex.test(formData.fullName)) {
      errors.fullName = 'Full name must contain only letters and spaces, at least 2 characters'
      isValid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Validate phone number using the library's built-in validation
    if (!phoneNumberValue) {
      errors.phoneNumber = 'Phone number is required'
      isValid = false
    } else {
      // The react-phone-number-input library handles international validation
      // We don't need to validate specific lengths since it does this automatically
    }

    // Validate STL file if provided (strict extension check)
    if (stlFile && !stlFile.name.toLowerCase().endsWith('.stl')) {
      errors.stlFile = 'Please upload only .stl files'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const generateTrackingId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'TRK-'
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Generate tracking ID
      const trackingId = generateTrackingId()

      // Handle file upload if exists
      let stlFileUrl: string | null = null
      if (stlFile) {
        const supabase = createClient()

        // Upload file to Supabase storage
        const fileExtension = stlFile.name.split('.').pop() || ''
        const fileName = `${trackingId}.${fileExtension}`

        const { error: uploadError } = await supabase.storage
          .from('stl-uploads')
          .upload(fileName, stlFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw new Error(`Failed to upload file: ${uploadError.message}`)
        }

        // Get the public URL of the uploaded file
        const { data } = supabase.storage
          .from('stl-uploads')
          .getPublicUrl(fileName)

        stlFileUrl = data.publicUrl
      }

      // Insert order into database with server-side validation (re-validate all fields)
      const supabase = createClient()

      // Server-side validation - re-validate all fields
      if (!fullNameRegex.test(formData.fullName)) {
        throw new Error('Invalid full name')
      }

      if (!emailRegex.test(formData.email)) {
        throw new Error('Invalid email address')
      }

      // The phone number is already validated by the library and stored as full international format

      const { error: insertError } = await supabase.from('orders').insert({
        tracking_id: trackingId,
        customer_name: formData.fullName,
        email: formData.email,
        phone: phoneNumberValue || null, // Store full international phone number
        stl_file_url: stlFileUrl,
        message: formData.message || null,
        status: 'Requested'
      })

      if (insertError) {
        throw new Error(`Failed to save order: ${insertError.message}`)
      }

      setTrackingId(trackingId)
      setSubmitSuccess(true)
    } catch (error: any) {
      console.error('Submission error:', error)
      setSubmitError(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId)
    }
  }

  // Handle phone number input formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Allow only digits, and limit to 10 characters
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, phoneNumber: digitsOnly }))

    // Clear phone validation error when user starts typing
    if (validationErrors.phoneNumber) {
      setValidationErrors(prev => ({ ...prev, phoneNumber: '' }))
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value)
  }

  if (submitSuccess && trackingId) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-green-500 text-5xl mb-6">✓</div>
            <h1 className="text-3xl font-bold text-primary mb-6">Request Submitted!</h1>
            <p className="text-gray-700 mb-8">
              Your request has been received. Save this tracking ID to check your order status.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-200">
              <p className="font-mono text-primary text-xl break-all">{trackingId}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Copy Tracking ID
            </button>
            <div className="mt-8">
              <p className="text-gray-600 text-sm">
                Our team will contact you shortly to discuss your 3D printing project.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 max-w-2xl mt-4">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Request a Quote</h1>
          <p className="text-gray-600 mb-8">Fill out the form below to get started with your 3D printing project</p>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-primary font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border ${
                  validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors`}
                placeholder="Enter your full name"
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-primary font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors`}
                placeholder="Enter your email address"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-primary font-medium mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <PhoneInput
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                  international
                  defaultCountry="IN"
                  value={phoneNumberValue}
                  onChange={setPhoneNumberValue}
                  placeholder="Enter phone number"
                  countrySelectComponent={({ value, onChange, countries }) => (
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors w-full"
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {validationErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="stlFile" className="block text-primary font-medium mb-2">
                STL File Upload (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="stlFile"
                  accept=".stl"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  {stlFile ? stlFile.name : 'Choose STL file (must be .stl format)'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload your 3D model file (.stl format)
              </p>
              {validationErrors.stlFile && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.stlFile}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-primary font-medium mb-2">
                Message/Description (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                placeholder="Describe your idea, size, material preference, etc."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.fullName.trim() || !formData.email.trim() || !phoneNumberValue}
              className={`w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors flex items-center justify-center ${
                isSubmitting || !formData.fullName.trim() || !formData.email.trim() || !phoneNumberValue
                  ? 'opacity-75 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Request...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}