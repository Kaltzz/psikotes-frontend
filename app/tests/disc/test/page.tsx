'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';

interface WordGroup {
  id: number;
  words: {
    text: string;
    type: 'D' | 'I' | 'S' | 'C';
  }[];
}

export default function DISCTestPage() {
  const router = useRouter();
  const [currentGroup, setCurrentGroup] = useState(0);
  const [answers, setAnswers] = useState<{
    most: { groupId: number; type: string }[];
    least: { groupId: number; type: string }[];
  }>({ most: [], least: [] });

  const [timeLeft, setTimeLeft] = useState(300); // 5 menit

  const wordGroups: WordGroup[] = [
    {
      id: 1,
      words: [
        { text: 'Tegas', type: 'D' },
        { text: 'Menyenangkan', type: 'I' },
        { text: 'Setia', type: 'S' },
        { text: 'Teliti', type: 'C' },
      ],
    },
    {
      id: 2,
      words: [
        { text: 'Ambisius', type: 'D' },
        { text: 'Optimis', type: 'I' },
        { text: 'Sabar', type: 'S' },
        { text: 'Perfeksionis', type: 'C' },
      ],
    },
  ];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTestComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelection = (type: 'most' | 'least', wordType: string) => {
    const newAnswers = { ...answers };
    if (type === 'most') {
      newAnswers.most[currentGroup] = { groupId: currentGroup, type: wordType };
    } else {
      newAnswers.least[currentGroup] = { groupId: currentGroup, type: wordType };
    }
    setAnswers(newAnswers);

    if (newAnswers.most[currentGroup] && newAnswers.least[currentGroup]) {
      setTimeout(() => {
        if (currentGroup < wordGroups.length - 1) {
          setCurrentGroup((prev) => prev + 1);
        } else {
          handleTestComplete();
        }
      }, 400);
    }
  };

  const handleTestComplete = () => {
    router.push('/tests/kraepelin');
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* ✅ Sticky Header Navbar */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">DISC Personality Test</h1>
          </div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">Instruksi</h2>
              <p className="text-gray-500 text-sm">
                Pilih kalimat yang <span className="text-green-600 font-semibold">PALING (P)</span> dan{' '}
                <span className="text-red-600 font-semibold">PALING TIDAK (K)</span> menggambarkan diri Anda.
              </p>
            </div>
            <div className="bg-gray-100 text-xl font-mono px-4 py-2 rounded-lg shadow-sm">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-2 text-center">
              Kelompok {currentGroup + 1} dari {wordGroups.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentGroup + 1) / wordGroups.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Soal */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 gap-4">
                {wordGroups[currentGroup].words.map((word, index) => {
                  const isMost = answers.most[currentGroup]?.type === word.type;
                  const isLeast = answers.least[currentGroup]?.type === word.type;

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                        isMost
                          ? 'border-green-500 bg-green-50'
                          : isLeast
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg font-medium text-gray-800">{word.text}</span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSelection('most', word.type)}
                          className={`px-4 py-2 text-sm rounded-md font-semibold transition-all ${
                            isMost
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-100 hover:bg-green-100 text-green-700'
                          }`}
                        >
                          PALING (P)
                        </button>
                        <button
                          onClick={() => handleSelection('least', word.type)}
                          className={`px-4 py-2 text-sm rounded-md font-semibold transition-all ${
                            isLeast
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-gray-100 hover:bg-red-100 text-red-700'
                          }`}
                        >
                          PALING TIDAK (K)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
