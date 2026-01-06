'use client'

import { Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function KraepelinTestPage() {
  
  type Answer = -1 | 0 | 1

  // const DURATION = 6
  const TOTAL_COLUMNS = 3
  const COLUMN_DURATION = 10 // detik
  const TOTAL_QUESTIONS = 10;

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(1)
  const [columnTimeLeft, setColumnTimeLeft] = useState(COLUMN_DURATION)
  const [numbers, setNumbers] = useState<[number, number]>([0, 0]);
  const [answers, setAnswers] = useState<Answer[][]>(
    Array.from({ length: TOTAL_COLUMNS }, () => [])
  )
  
  const moveToNextColumn = () => {
  const colIndex = currentColumn - 1

  // isi sisa soal dengan 0
  fillRemainingWithZero(colIndex)

  if (currentColumn < TOTAL_COLUMNS) {
    setCurrentColumn(prev => prev + 1)
    setCurrentIndex(0)
    setColumnTimeLeft(COLUMN_DURATION)
    generateNumbers()
  } else {
    router.push("/tests/disc")
  }
}

  // generate soal baru
  const generateNumbers = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNumbers([a, b]);
  };

  const handleTestComplete = () => {
    router.push('/tests/kraepelin');
  }
  
  useEffect(() => {
    generateNumbers();
  }, []);
  
  useEffect(() => {
    console.log('jawaban: ', answers)
    })
  
  useEffect(() => {
    console.log('Currentindex: ', currentIndex)
  })

  useEffect(() => {
    if (currentColumn > TOTAL_COLUMNS) return

    if (columnTimeLeft <= 0) {
      moveToNextColumn()
      return
      }

    const timer = setInterval(() => {
    setColumnTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [columnTimeLeft, currentColumn])


  
  const handleInput = (value: string) => {
  if (!/^\d$/.test(value)) return

  const [a, b] = numbers
  const correctAnswer = (a + b) % 10
  const isCorrect: Answer = Number(value) === correctAnswer ? 1 : -1

  setAnswers(prev => {
    const updated = [...prev]
    updated[currentColumn - 1] = [
      ...updated[currentColumn - 1],
      isCorrect
    ]
    return updated
  })

  // soal masih ada
  if (currentIndex < TOTAL_QUESTIONS - 1) {
    setCurrentIndex(prev => prev + 1)
    generateNumbers()
  } else {
    // soal kolom habis → langsung pindah kolom
    moveToNextColumn()
  }
} 
  const fillRemainingWithZero = (columnIndex: number) => {
  setAnswers(prev => {
    const updated = [...prev]
    const answeredCount = updated[columnIndex].length
    const remaining = TOTAL_QUESTIONS - answeredCount

    if (remaining > 0) {
      updated[columnIndex] = [
        ...updated[columnIndex],
        ...Array(remaining).fill(0)
      ]
    }

    return updated
  })
}

  return(
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
         <div className="flex items-center gap-2">
          <Brain className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">Tes Kraepelin (Pauli)</h1>
          </div>
        </div>
      </header>

      {/* Konten utama */}
      <main className="flex-1 overflow-hidden px-4 py-6">
        <div className="h-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
          {/* Header info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="md:flex-1 text-center md:text-left">
              <div className=" font-bold text-gray-800 mb-1 text-center flex flex-col justify-center gap-y-2">
                <div className="text-lg">
                  Kolom {currentColumn} dari {TOTAL_COLUMNS}
                </div>
                <div className="text-xl">
                  Sisa waktu: {columnTimeLeft} detik
                </div>
              </div>
            </div>

            {/* Timer */}
            
          </div>

            {/* Grid angka */}
            <div className='flex flex-col justify-center items-center gap-x-4  '>
              {/* AREA SOAL (ATAS) */}
              <div className="flex justify-center items-center mb-10">
                
                  <div className="flex flex-col gap-y-4 text-5xl font-bold text-center">
                    <div>{numbers[0]}</div>
                    <div>{numbers[1]}</div>
                  </div>
                
              </div>

              {/* AREA NUMPAD (BAWAH) */}
              {currentColumn < TOTAL_COLUMNS + 1 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-xs mx-auto">
                  {[1,2,3,4,5,6,7,8,9,0].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleInput(String(num))}
                      className="h-14 text-xl font-bold rounded-xl p-5 bg-gray-200 hover:bg-blue-500 hover:text-white transition"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              
            </div>
        </div>
      </main>
    </div>
  )
}