'use client'

import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface PapiQuestion {
    id: number,
    sentences: {
        text: string
        type: 
         'G' | 'L' | 'I' | 'T' | 'V' | 'S' | 'R' | 'D' | 'C' | 'E' | 
         'N' | 'A' | 'P' | 'X' | 'B' | 'O' | 'Z' | 'K' | 'F' | 'W'

    }[]
}

export default function PapiTestPage() {
    const router = useRouter()
    const [currentGroup, setCurrentGroup] = useState(0)
    const [answers, setAnswers] = useState<
        { groupId: number; type: string }[]
        >([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 menit


    const papi: PapiQuestion[]  = [
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

    useEffect(() => {
        if (timeLeft <= 0) {
        handleTestComplete();
        return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(()=> {
            console.log('isi new answers: ', answers)
        }, [answers])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelection = (newType: string) => {
        setAnswers(prev => {
            const updated = [...prev];

            updated[currentGroup] = {
            groupId: currentGroup,
            type: newType,
            };

            return updated; 
        })
    }

    const handleStart = () => {
    router.push('/tests/disc/test');
    };

    const handleNext = () => {
        setCurrentGroup(prev => prev + 1)
    }
    const handleTestComplete = () => {
        router.push('/tests/mbti');
    };

    return(
        <div className="font-sans min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Brain className="text-blue-600" size={28} />
                        <h1 className="text-xl font-bold text-gray-800">DISC Personality Test</h1>
                    </div>
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
                    Kelompok {currentGroup + 1} dari {papi.length}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentGroup + 1) / papi.length) * 100}%` }}
                    />
                    </div>
                </div>

                {/* Soal */}
                <section className="mb-10">
                    <div className="flex justify-center items-center flex-col bg-white rounded-lg p-8 text-gray-400 italic">
                        <div className='w-full'>
                        <AnimatePresence mode="wait">
                            <motion.div
                            key={currentGroup}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.4 }}
                            >
                                <div>

                                </div>
                            <div className="grid grid-cols-1 gap-4 w-full">
                                {papi[currentGroup].sentences.map((sentence, index) => {

                                const selected = answers[currentGroup]?.type === sentence.type;

                                return (
                                    <div
                                    className="flex gap-3 "
                                    key={index}
                                    >
                                        <button
                                        // disabled={(!isMost && mostTaken) || isLeast}
                                        onClick={() => handleSelection(sentence.type)}
                                        className={`p4 rounded-md text-lg font-medium border border-gray-300 text-gray-700 flex items-center justify-between p-4 transition-all  w-full  ${
                                            selected
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 hover:bg-gray-300'
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
                                        currentGroup === papi.length - 1
                                            ? handleTestComplete
                                            : handleNext
                                        }
                                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        {currentGroup === papi.length - 1 ? 'Selesai' : 'Soal Berikutnya →'}
                                    </button>
                                </div>
                        </div> 
                    </div>
                </section>
                </div>
            </main>

        </div>
    )
}