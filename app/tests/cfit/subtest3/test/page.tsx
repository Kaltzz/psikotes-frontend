'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
    id: number;
    images: string[];
}


export default function CFITSubtest3Test() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(180); // 3 menit
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    
    const questions: Question[] = [
        {
            id: 1,
            images: ['q1-1.png', 'q1-2.png', 'q1-3.png', 'q1-4.png'],
        },
        {
            id: 2,
            images: ['q2-1.png', 'q2-2.png', 'q2-3.png', 'q2-4.png',],
        },
    ];

    useEffect(() => {
        if (timeLeft <= 0) {
        handleTestComplete();
        return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleTestComplete = () => {
        router.push('/tests/cfit/subtest4');
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;
        return `${minutes}:${remaining.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
            console.log('answers berubah:', answers);
            }, [answers]);

    const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">CFIT — Subtes 3</h1>
              <p className="text-sm text-slate-500">Temukan pola urutan pada rangkaian gambar berikut.</p>
            </div>
            <div className="mt-4 md:mt-0 bg-slate-100 text-slate-800 px-5 py-2 rounded-xl font-mono text-lg tracking-wider border border-slate-200">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2 text-slate-600">
              <span>Soal {currentQuestion + 1} / {questions.length}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Soal */}
          <div className="border rounded-2xl bg-white shadow-sm p-6 mb-8">
            <div className="w-1/2 grid grid-cols-2 md:grid-cols-2 gap-3 mb-6 m-auto">
              {questions[currentQuestion].images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"
                >
                  <span className="text-xs font-medium">Gambar {i + 1}</span>
                </div>
              ))}
            </div>

            <div className="text-center text-slate-700 mb-6">
              Pilih gambar yang paling tepat untuk melengkapi pola:
            </div>

            {/* Pilihan Jawaban */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(option => {
                return(
                  <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`aspect-square text-lg font-semibold rounded-xl flex items-center justify-center transition-all border-2 ${
                    answers[currentQuestion] === option
                      ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:scale-[1.02]'
                  }`}
                >
                  {option}
                </button>
                )
              })}
            </div>
          </div>

          {/* Navigasi Soal */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                currentQuestion === 0
                  ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              ← Sebelumnya
            </button>

            <button
              onClick={
                currentQuestion === questions.length - 1
                  ? handleTestComplete
                  : () => setCurrentQuestion(prev => prev + 1)
              }
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
            >
              {currentQuestion === questions.length - 1 ? 'Selesai Tes' : 'Soal Berikutnya →'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Waktu berjalan otomatis. Tes akan selesai saat waktu habis.
        </div>
      </main>
    </div>
    )
}