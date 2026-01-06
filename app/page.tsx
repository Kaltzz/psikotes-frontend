'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    jenisKelamin: '',
    pendidikan: '',
    jurusan: '',
    token: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { nama, usia, jenisKelamin, pendidikan, jurusan, token } = formData
    if (!nama || !usia || !jenisKelamin || !pendidikan || !jurusan || !token) {
      alert('Mohon lengkapi semua data.')
      return
    }

    setIsSubmitting(true)
    localStorage.setItem('userData', JSON.stringify(formData))

    switch (token.toLowerCase()) {
      case '123':
        router.push('/tests/cfit')
        break
      case 'cfit':
        router.push('/tests/cfit')
        break
      case 'kraepelin':
        router.push('/tests/kraepelin')
        break
      default:
        alert('Token tidak valid.')
        setIsSubmitting(false)
    }
  }

  const isFormValid = Object.values(formData).every(v => v.trim() !== '') && !isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-10">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4">
          <h1 className="text-xl font-bold tracking-wide">Data Diri Peserta</h1>
          <p className="text-xs opacity-90">Isi data sebelum memulai tes</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenisKelamin"
                id="jenisKelamin"
                required  
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Usia */}
            <div>
              <label htmlFor="usia" className="block text-sm font-medium text-gray-700 mb-1">
                Usia
              </label>
              <input
                type="number"
                name="usia"
                id="usia"
                required
                value={formData.usia}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: 20"
              />
            </div>

            

            {/* Pendidikan */}
            <div>
              <label htmlFor="pendidikan" className="block text-sm font-medium text-gray-700 mb-1">
                Pendidikan Terakhir
              </label>
              <input
                type="text"
                name="pendidikan"
                id="pendidikan"
                required
                value={formData.pendidikan}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: SMA / S1"
              />
            </div>

            {/* Pekerjaan */}
            <div>
              <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700 mb-1">
                Jurusan
              </label>
              <input
                type="text"
                name="jurusan"  // (perubahan) kesalahan penulisan name, sebelumnya jursan @rezky
                id="jurusan"
                required
                value={formData.jurusan}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: Teknik Informatika"
              />
            </div>

            {/* Token */}
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                Token Tes
              </label>
              <input
                type="text"
                name="token"
                id="token"
                required
                value={formData.token}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm"
                placeholder="Contoh: 123"
              />
            </div>

            {/* Tombol */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-200 
                ${isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {isSubmitting ? 'Memproses...' : 'Mulai Tes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
