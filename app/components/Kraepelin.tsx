'use client'

// const TOTAL_COLUMNS = 45;
// const TOTAL_QUESTIONS = 50;

// // dummy data
// const answers: number[][] = Array.from(
//   { length: TOTAL_COLUMNS },
//   (_, colIndex) => {
//     const correctCount =
//       colIndex < 10 ? 35 :
//       colIndex < 20 ? 30 :
//       colIndex < 30 ? 25 :
//       colIndex < 40 ? 20 :
//       15;

//     return Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
//       i < correctCount ? 1 : 0
//     );
//   }
// );

// const answers: number[][] = [
//   // Lajur 1 (50 soal)
//   [
//     1,1,1,1,1,1,1,1,1,1,
//     1,1,1,1,1,1,1,1,1,1,
//     1,1,1,1,1,1,1,1,1,1,
//     1,1,1,1,1,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0
//   ],

//   // Lajur 2
//   [
//     1,1,1,1,1,1,1,1,1,1,
//     1,1,1,1,1,1,1,1,1,1,
//     1,1,1,1,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0
//   ],

//   // Lajur 3
//   [
//     1,1,1,1,1,1,1,1,1,1,
//     1,1,1,1,1,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0
//   ],

//   // Lajur 4
//   [
//     1,1,1,1,1,1,1,1,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0
//   ],

//   // Lajur 5
//   [
//     1,1,1,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,0,0,0,
//     0,0,0,0,0,0,0,
//   ]

// ]

import { useState } from "react"
import KraepelinLineChart from "./KraepelinLineChartComponent"

type Answer = -1 | 0 | 1

const TOTAL_COLUMNS = 3

function calculatePanker(answers: Answer[][]) {
  let totalWorked = 0

  answers.forEach(column => {
    column.forEach(value => {
      if (value === 1 || value === -1) {
        totalWorked += 1
      }
    })
  })

  return totalWorked / TOTAL_COLUMNS
}

const calculateHanker = (answers: Answer[][]) => {
  const lastCorrectIndexes: number[] = []

  answers.forEach(column => {
    // cari index terakhir dari nilai 1
    const lastIndex = column.lastIndexOf(1)

    if (lastIndex !== -1) {
      // +1 supaya sesuai nomor soal (bukan index array)
      lastCorrectIndexes.push(lastIndex + 1)
    }
  })

  // jika tidak ada jawaban benar sama sekali
  if (lastCorrectIndexes.length === 0) return 0

  const max = Math.max(...lastCorrectIndexes)
  const min = Math.min(...lastCorrectIndexes)

  return max - min
}

const calculateTianker = (answers: Answer[][]) => {
  if (answers.length < 2) return 0

  const firstColumn = answers[0]
  const lastColumn = answers[answers.length - 1]

  const countAnswered = (column: Answer[]) =>
    column.filter(v => v === 1 || v === -1).length

  const firstCount = countAnswered(firstColumn)
  const lastCount = countAnswered(lastColumn)

  return firstCount - lastCount
}

const calculateJankerKeajegan = (answers: Answer[][]) => {
  let totalError = 0
  let totalAnswered = 0

  answers.forEach(column => {
    column.forEach(value => {
      if (value === 1 || value === -1) {
        totalAnswered++
      }

      if (value === -1 || value === 0) {
        totalError++
      }
    })
  })

  if (totalAnswered === 0) return 0

  return totalError / totalAnswered
}


export default function Kraepelin() {

  // ⛔ nanti ini diganti dari hasil tes asli
  const [answers] = useState<Answer[][]>([
    [1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 0, 0, 0, 0],
    [1, -1, -1, 1, 1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 0, 0],
    [1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, -1, 1, 1, -1, 0, 0],
    // ... sampai 45 kolom
  ])

  const panker = calculatePanker(answers)
  const janker = calculateJankerKeajegan(answers)
  const tianker = calculateTianker(answers)
  const hanker = calculateHanker(answers)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hasil Tes Kraepelin</h1>
      <div className="flex flex-col gap-y-3">
        <div className="text-base">
          <strong>PANKER:</strong> {panker.toFixed(2)}
        </div>
        <div className="text-base">
          <strong>JANKER:</strong> {janker.toFixed(2)}
        </div>
        <div className="text-base">
          <strong>HANKER (Keajegan Kerja):</strong> {hanker}
        </div>
        <div className="text-base">
          <strong>TIANKER (Ketelitian Kerja):</strong> {tianker}
        </div>

        <div className="p-8">
          <h1 className="text-lg font-bold mb-6">Grafik (jawaban benar dan salah) tiap kolom</h1>
          <KraepelinLineChart answers={answers} />
        </div>

        <div>

        </div>

      </div>
      
    </div>
  )
}