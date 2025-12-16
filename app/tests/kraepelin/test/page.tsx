'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Clock } from 'lucide-react'

export default function KraepelinTwoColumn() {
  const router = useRouter()
  const DURATION = 30 // durasi tiap baris
  const numbers = [
    [6, 3, 4, 8, 2, 7, 5, 9, 1, 4],
    [2, 5, 7, 1, 6, 3, 4, 8, 9, 2],
    [1, 9, 3, 6, 2, 4, 5, 7, 8, 1],
  ]

  const [currentRow, setCurrentRow] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [isFinished, setIsFinished] = useState(false)
  const currentNumbers = numbers[currentRow]
  const pairCount = currentNumbers.length - 1
  const [answers, setAnswers] = useState<string[]>(Array(pairCount).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer
  useEffect(() => {
    if (isFinished) return

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t)

          if (currentRow < numbers.length - 1) {
            setCurrentRow((r) => r + 1)
            setAnswers(Array(pairCount).fill(''))
            setTimeLeft(DURATION)
          } else {
            setIsFinished(true)
          }

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(t)
  }, [isFinished, currentRow])

  // Fokus input pertama setiap ganti lajur
  useEffect(() => {
    if (!isFinished && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [currentRow])

  // 🚀 Redirect otomatis ke /result setelah tes selesai
  useEffect(() => {
    if (isFinished) {
      const timeout = setTimeout(() => {
        router.push('/result')
      }, 1500) // kasih jeda 1.5 detik biar transisi halus
      return () => clearTimeout(timeout)
    }
  }, [isFinished, router])

  const handleAnswerChange = (index: number, val: string) => {
    const v = val.replace(/[^0-9]/g, '').slice(0, 1)
    setAnswers((prev) => {
      const copy = [...prev]
      copy[index] = v
      return copy
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index < pairCount - 1) {
        inputRefs.current[index + 1]?.focus()
      } else {
        setIsFinished(true)
      }
    }
  }

  const rows = Array(currentNumbers.length * 2 - 1).fill('auto').join(' ')

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (isFinished) {
    // Tampilan sementara sebelum redirect
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tes Selesai!</h2>
        <p className="text-gray-600 text-sm">Mengalihkan ke halaman hasil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">Tes Kraepelin (Pauli)</h1>
          </div>
        </div>
      </header>

      {/* Konten utama */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="md:flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Instruksi Tes</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Jumlahkan dua angka yang berdekatan secara{' '}
                <span className="font-semibold text-blue-600">vertikal</span> ke bawah.
                Tulis hasil penjumlahan di kolom kanan (hanya digit terakhir).
                Setiap lajur memiliki waktu{' '}
                <span className="font-semibold text-blue-600">30 detik</span>.
              </p>
            </div>

            {/* Timer */}
            <div className="md:flex-none bg-gray-100 text-lg font-mono px-5 py-2 rounded-lg shadow-sm text-gray-700">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Grid angka */}
          <div
            className="mt-4 bg-slate-50 p-4 rounded-xl shadow-sm"
            style={{
              display: 'grid',
              gridTemplateColumns: 'min-content min-content',
              gridTemplateRows: rows,
              columnGap: '6px',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            {/* Kolom angka kiri */}
            {currentNumbers.map((num, i) => {
              const row = i * 2 + 1
              return (
                <div
                  key={`num-${i}`}
                  style={{ gridColumn: 1, gridRow: row }}
                  className="text-right pr-1"
                >
                  <div className="text-lg font-mono text-slate-800 leading-tight">{num}</div>
                </div>
              )
            })}

            {/* Kolom input kanan */}
            {Array.from({ length: pairCount }).map((_, idx) => {
              const row = idx * 2 + 2
              return (
                <div
                  key={`input-${idx}`}
                  style={{ gridColumn: 2, gridRow: row }}
                  className="flex items-center justify-center"
                >
                  <input
                    ref={(el) => {
                      inputRefs.current[idx] = el
                    }}
                    inputMode="numeric"
                    value={answers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-9 h-8 text-center border border-slate-300 rounded-lg font-mono text-base focus:ring-2 focus:ring-blue-400 outline-none transition"
                    maxLength={1}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
