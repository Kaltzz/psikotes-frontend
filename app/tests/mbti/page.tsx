'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Info, Clock, ListChecks } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { div } from 'framer-motion/client';

interface MbtiQuestion {
    id: number,
    sentences: {
        text: string
        type: 
         'G' | 'L' | 'I' | 'T' | 'V' | 'S' | 'R' | 'D' | 'C' | 'E' | 
         'N' | 'A' | 'P' | 'X' | 'B' | 'O' | 'Z' | 'K' | 'F' | 'W'

    }[]
}

function IconPersonality() {
  return (
    <svg
      className="w-6 h-6 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


export default function MbtiInstructionPage() {
    const router = useRouter()
    const [currentGroup, setCurrentGroup] = useState(0)
    const [answers, setAnswers] = useState<
        { groupId: number; type: string }[]
        >([]);
    
    const mbti: MbtiQuestion[]  = [
        {
            id: 1,
            sentences: [
                {text: 'Saya suka menjadi pendengar', type: 'R'},
                {text: 'Saya mengerjakan semua pekerjaan sekaligus', type: 'F'}
            ]
        },
        {
            id: 2,
            sentences: [
                {text: 'Saya orangnya teliti', type: 'I'},
                {text: 'Saya ingin menjadi pemimpin', type: 'A'}
            ]
        },
        {
            id: 3,
            sentences: [
                {text: 'Saya ingin bebas', type: 'I'},
                {text: 'Saya suka hal yang baru', type: 'G'}
            ]
        }
    ]

    const handleStart = () => {
    router.push('/tests/mbti/test');
    };

    const handleNext = () => {
        // resetState()
        setCurrentGroup(prev => prev + 1)
    }

    const handleTestComplete = () => {
        resetState()
        router.push('/tests/mbti/test');
    };

    const handleSelection = (newType: string) => {
        setAnswers(prev => {
            const updated = [...prev];

            updated[currentGroup] = {
            groupId: currentGroup,
            type: newType,
            };

            return updated;
  });

       
    }

    useEffect(()=> {
        console.log('isi new answers: ', answers)
    }, [answers])

    const resetState = () => {
        setAnswers([]);
    }

    return(
        <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Brain className="text-blue-600" size={28} />
                    <h1 className="text-xl font-bold text-gray-800">Tes Kepribadian MBTI (Myers-Briggs Type Indicator)</h1>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
            >
            {/* Card utama */}
            <section>
                <div className="p-6 md:p-8">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <nav className="text-xs text-slate-500 mb-2" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-2">
                        <li>
                        <Link href="/tests" className="hover:underline">
                            Tes
                        </Link>
                        </li>
                        <li>
                        <span className="text-slate-400">/</span>
                        </li>
                        <li className="font-medium text-slate-700">MBTI</li>
                    </ol>
                    </nav>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Tes Kepribadian MBTI
                    </h2>
                    {/* <p className="mt-2 text-sm text-slate-600">
                        Tes untuk mengidentifikasi kebutuhan, motivasi, dan gaya perilaku individu dalam lingkungan kerja.
                    </p> */}
                </div>

                {/* Info box */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="text-blue-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                        <div className="text-slate-800 font-medium">Durasi</div>
                        <div className="text-slate-600">15 menit</div>
                    </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                        <div className="text-amber-600">
                            <Info className="w-5 h-5" />
                        </div>
                        <div className="text-sm">
                            <div className="text-slate-800 font-medium">Jumlah Soal</div>
                            <div className="text-slate-600">90 Soal</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="text-emerald-600">
                        <IconPersonality />
                    </div>
                        <div className="text-sm">
                            <div className="text-slate-800 font-medium">Tujuan</div>
                            <div className="text-slate-600">Mengetahui motivasi kerja</div>
                        </div>
                    </div>
                </div>

                {/* Section: Petunjuk */}
                <section className="mt-10 mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <ListChecks className="text-blue-600" size={22} />
                    Petunjuk Tes MBTI
                    </h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">
                        Pada tes ini, Anda akan diberikan sejumlah pernyataan yang menggambarkan sikap atau perilaku kerja. Setiap kelompok berisi dua pernyataan.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Pilih satu kata yang paling menggambarkan diri Anda.</li>
                        <li>
                        <Clock className="inline-block text-blue-500 mr-1" size={16} />
                        Waktu pengerjaan: <span className="font-semibold">15 menit</span>
                        </li>
                    </ul>
                    </div>
                </section>

                {/* Section: Contoh Soal */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
                    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-4">
                        Berikut contoh tampilan soal MBTI. Pilih satu kata yang paling menggambarkan diri Anda.
                    </p>
                    <div className="flex justify-center items-center flex-col bg-white rounded-lg p-8 border text-gray-400 italic">
                        <div className='w-full'>
                        <AnimatePresence mode="wait">
                            <motion.div
                            key={currentGroup}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4 }}
                            >
                            <div className="grid grid-cols-1 gap-4 w-full">
                                {mbti[currentGroup].sentences.map((sentence, index) => {

                                const selected = answers[currentGroup]?.type === sentence.type;

                                return (
                                    <div
                                    className="flex gap-3 "
                                    key={index}
                                    >
                                        <button
                                        // disabled={(!isMost && mostTaken) || isLeast}
                                        onClick={() => handleSelection(sentence.type)}
                                        className={`p4 rounded-md text-lg font-medium border  text-gray-700 flex items-center justify-between p-4 transition-all  w-full  ${
                                            selected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 hover:bg-gray-300 border-gray-300'
                                            }`}
                                        >
                                        {sentence.text}
                                        </button>

                                    </div>
                                );
                                })}
                            </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between items-center mt-7">
                                    <button
                                        onClick={() => 
                                        {
                                            setCurrentGroup(prev => Math.max(0, prev - 1))
                                            // resetState()
                                        }}
                                        disabled={currentGroup === 0}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                                        currentGroup === 0
                                            ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                                            : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                                        }`}
                                    >
                                        ← Sebelumnya
                                    </button>

                                    <button
                                        onClick={
                                        currentGroup === mbti.length - 1
                                            ? handleTestComplete
                                            : handleNext
                                        }
                                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        {currentGroup === mbti.length - 1 ? 'Selesai' : 'Soal Berikutnya →'}
                                    </button>
                                </div>
                        </div>
                        
                    </div>
                    </div>
                </section>

                {/* Tombol aksi */}
                <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                    <strong className="text-slate-800">Sebelum mulai:</strong> pastikan
                    Anda berada di tempat yang tenang dan siap fokus.
                    </div>
                    <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:shadow-lg transition-all"
                    >
                    Mulai Tes
                    </motion.button>
                </div>
                </div>
            </section>

            {/* Footer kecil */}
            <div className="mt-6 text-center text-xs text-slate-400">
                Sistem ini menampilkan instruksi — waktu akan mulai otomatis saat tes dimulai.
            </div>
            </motion.div>
        </main>
        </div>
    )
}