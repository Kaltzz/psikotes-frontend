'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { json } from 'stream/consumers'

export default function AdminLoginForm() {
    
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev=> ({...prev, [name]: value}))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const {username, password} = formData
        if(!username || !password) {
            alert('Mohon Lengkapi semua data')
            return
        }

        setIsSubmitting(true)
        localStorage.setItem('userdata', JSON.stringify(formData))
    }

    const isFormValid = Object.values(formData).every(v => v.trim() !== '') && !isSubmitting


    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-10">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4">
          <h1 className="text-xl font-bold tracking-wide">DASHBOARD ADMIN</h1>
          <p className="text-xs opacity-90">tes psikotes</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan Username"
              />
            </div>

            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan Password"
              />
            </div>

            {/* Tombol */}
            <div className='flex justify-center'>
              <button
                onClick={() => {
                  router.push('dashboard')
                }}
                className={`w-1/2  py-2 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                `}
              >
                Login
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
    )
}

{/* ${isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'} */}