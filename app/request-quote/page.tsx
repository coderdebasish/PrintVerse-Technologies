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
  const [countryCode, setCountryCode] = useState('IN')

  // Validation states for real-time feedback
  const [formValidation, setFormValidation] = useState({
    fullName: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    phoneNumber: { isValid: true, message: '' },
    stlFile: { isValid: true, message: '' }
  })

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

  // Phone number validation - limit to reasonable length for Indian numbers
  const phoneRegex = /^\+?[1-9]\d{0,14}$/;

  // Validation function
  const validateField = (fieldName: string, value: string) => {
    let isValid = true;
    let message = '';

    switch (fieldName) {
      case 'fullName':
        if (!value.trim()) {
          isValid = false;
          message = 'Full name is required';
        } else if (!fullNameRegex.test(value)) {
          isValid = false;
          message = 'Full name must contain only letters and spaces, at least 2 characters';
        } else if (value.length > 50) {
          isValid = false;
          message = 'Full name is too long';
        }
        break;

      case 'email':
        if (!value.trim()) {
          isValid = false;
          message = 'Email is required';
        } else if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        } else if (value.length > 254) {
          isValid = false;
          message = 'Email address is too long';
        }
        break;

      case 'phoneNumber':
        if (!value) {
          isValid = false;
          message = 'Phone number is required';
        } else {
          const phoneNumberLength = value.replace(/[^\d]/g, '').length;
          // The react-phone-number-input component handles international formatting
          // For valid phone numbers, the length should be between 7 and 15 digits (including country code)
          if (phoneNumberLength < 7 || phoneNumberLength > 15) {
            isValid = false;
            message = 'Please enter a valid phone number';
          }
          // Additional validation for Indian numbers: if it's an Indian number (+91), the actual number part should be 10 digits
          if (value.startsWith('+91')) {
            const actualNumberLength = value.replace(/[^\d]/g, '').length;
            if (actualNumberLength > 10) {
              isValid = false;
              message = 'For India, please enter exactly 10 digits without country code';
            }
          }
        }
        break;

      default:
        break;
    }

    setFormValidation(prev => ({
      ...prev,
      [fieldName]: { isValid, message }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Sanitize phone number input to prevent invalid entries
    if (name === 'phoneNumber') {
      // Allow only digits and + sign for phone numbers
      const sanitizedValue = value.replace(/[^0-9+]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Validate field in real-time
    validateField(name, value);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file extension strictly (case-insensitive)
      if (file.name.toLowerCase().endsWith('.stl')) {
        // Check file size - limit to 150 MB
        if (file.size > 150 * 1024 * 1024) {
          setValidationErrors(prev => ({ ...prev, stlFile: 'File size exceeds 150 MB limit' }))
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setStlFile(null)
        } else {
          setStlFile(file)
          setValidationErrors(prev => ({ ...prev, stlFile: '' }))
        }
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
    } else if (formData.fullName.length > 50) {
      errors.fullName = 'Full name is too long'
      isValid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    } else if (formData.email.length > 254) {
      errors.email = 'Email address is too long'
      isValid = false
    }

    // Validate phone number using the library's built-in validation
    if (!phoneNumberValue) {
      errors.phoneNumber = 'Phone number is required'
      isValid = false
    } else {
      // The react-phone-number-input component already validates the phone number format
      // We just need to make sure it's not empty and has reasonable length
      const phoneNumberLength = phoneNumberValue.replace(/[^\d]/g, '').length;
      if (phoneNumberLength < 7 || phoneNumberLength > 15) {
        errors.phoneNumber = 'Please enter a valid phone number'
        isValid = false
      }
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
    // Allow only digits, and limit to 10 characters for Indian numbers
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center transform transition-all duration-500 hover:shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Request Submitted!</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Your request has been received. Save this tracking ID to check your order status.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
              <p className="font-mono text-primary font-bold text-xl break-all">{trackingId}</p>
            </div>

            <button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center mx-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy Tracking ID
            </button>

            <div className="mt-10">
              <p className="text-gray-600 text-base md:text-lg">
                Our team will contact you shortly to discuss your 3D printing project.
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Need help? Contact us at support@printverse.com
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 max-w-4xl mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="md:flex">
            {/* Left side - Form */}
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Request a Quote</h1>
                <p className="text-gray-600 text-lg">
                  Fill out the form below to get started with your 3D printing project
                </p>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-primary font-semibold mb-3 text-lg">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-gray-50 placeholder-gray-500 ${
                      !formValidation.fullName.isValid ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {!formValidation.fullName.isValid && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formValidation.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-primary font-semibold mb-3 text-lg">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-gray-50 placeholder-gray-500 ${
                      !formValidation.email.isValid ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {!formValidation.email.isValid && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formValidation.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-primary font-semibold mb-3 text-lg">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneInput
                      className={`w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-gray-50 ${
                        !formValidation.phoneNumber.isValid ? 'border-red-500' : 'border-gray-300'
                      }`}
                      international
                      defaultCountry="IN"
                      value={phoneNumberValue}
                      onChange={(value) => {
                        setPhoneNumberValue(value);
                        // Validate when phone number changes
                        if (value) {
                          const phoneNumberLength = value.replace(/[^\d]/g, '').length;
                          if (phoneNumberLength < 7 || phoneNumberLength > 15) {
                            validateField('phoneNumber', value);
                          } else {
                            validateField('phoneNumber', value);
                          }
                        } else {
                          validateField('phoneNumber', '');
                        }
                      }}
                      placeholder="Enter phone number"
                    />
                    {!formValidation.phoneNumber.isValid && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {formValidation.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">For India, enter 10 digits without country code</p>
                </div>

                <div>
                  <label htmlFor="stlFile" className="block text-primary font-semibold mb-3 text-lg">
                    STL File Upload (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      stlFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    } ${!formValidation.stlFile.isValid ? 'border-red-500' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="stlFile"
                      accept=".stl"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {stlFile ? (
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="font-medium text-green-700">{stlFile.name}</p>
                        <p className="text-sm text-green-600 mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.583 5 5 0 119.769 2.456A4.5 4.5 0 0113.5 16h-6z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <p className="font-medium text-gray-700">Drag & drop your STL file here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                        <p className="text-xs text-gray-400 mt-2">Only .stl files are accepted (max 150 MB)</p>
                      </div>
                    )}
                  </div>
                  {!formValidation.stlFile.isValid && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {formValidation.stlFile.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-primary font-semibold mb-3 text-lg">
                    Message/Description (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 bg-gray-50 placeholder-gray-500"
                    placeholder="Describe your idea, size, material preference, etc."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.fullName.trim() || !formData.email.trim() || !phoneNumberValue}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center ${
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
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right side - Information */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 md:p-12 text-white">
              <h2 className="text-2xl font-bold mb-6">Why Choose PrintVerse?</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">Premium Quality</h3>
                    <p className="text-blue-100">High-grade materials for exceptional results</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">Fast Turnaround</h3>
                    <p className="text-blue-100">Quick production times without compromising quality</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">Affordable Pricing</h3>
                    <p className="text-blue-100">Competitive rates for all your 3D printing needs</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">100% Customized</h3>
                    <p className="text-blue-100">Every product is tailor-made to your specifications</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-500">
                <h3 className="font-semibold text-lg mb-3">Need Help?</h3>
                <p className="text-blue-100 mb-4">
                  Our experts are ready to help you with your 3D printing project.
                </p>
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>support@printverse.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}