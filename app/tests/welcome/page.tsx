'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import test from "node:test"
import { useEffect, useState } from "react"



export default function frontPage()  {
    const router = useRouter()
    const [data, setData] = useState()

//     useEffect(()=> {
//     const tests = sessionStorage.getItem('testSession')
//     console.log(tests)
// }, [])

    const handleClick = () => {
        // if(typeof !window=== undefined) {
        //     const tests = sessionStorage.getItem('testSession')
        //     console.log(tests)
        // } else{
        //     console.log("gagal")
        // }

        const testSession = sessionStorage.getItem('testSession')
        if(!testSession)
            return console.log('gagal')

        const testSessionParsed = JSON.parse(testSession)
        const tests = testSessionParsed.tests[testSessionParsed.currentIndex]
        if(tests) {
            router.push(`/tests/${tests.toLowerCase()}`)
            const indexIncrement = testSessionParsed.currentIndex + 1
            testSessionParsed.currentIndex = indexIncrement

            const updatedTestString = JSON.stringify(testSessionParsed)
            sessionStorage.setItem('testSession', updatedTestString)        
        } else {
            router.push('/result')
        } 
    }
    
    return (
        <div>
            <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
                <main className="container mx-auto px-4 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 "
                    >
                        <div>
                            <h2 className="text-2xl text-left md:text-3xl font-bold text-slate-800 mb-4">Selamat Datang di Sesi Tes Anda</h2>
                            <p className="mt-3 text-base text-slate-700 text-left">Pendaftaran Anda telah berhasil dan data Anda telah diverifikasi oleh sistem.
                            Pada tahap selanjutnya, Anda akan mengikuti rangkaian tes psikologi sesuai dengan token yang telah diberikan kepada Anda.

                            <span className="block mt-2">Setiap tes memiliki tujuan dan aturan pengerjaan yang berbeda.
                            Oleh karena itu, sangat disarankan untuk membaca petunjuk pada setiap tes dengan saksama sebelum memulai..</span></p>
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">Petunjuk Umum</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Pastikan Anda berada di tempat yang nyaman dan minim gangguan.
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Gunakan perangkat dan koneksi internet yang stabil.
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Kerjakan tes secara mandiri dan jujur.
                                </li>
                                <li className="flex gap-3 items-start">
                                    <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                                    Jangan menutup atau memuat ulang halaman sebelum tes selesai.
                                </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-600">
                                <strong className="text-slate-800">Sebelum mulai:</strong> pastikan diri anda telah siap dan fokus.
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:scale-[1.01] active:scale-95 transition-transform"
                                    aria-label="Mulai CFIT Subtes 1"
                                    onClick={handleClick}
                                >
                                    Selanjutnya
                                </button>
                            </div>
                            
                        </div>
                        
                    </motion.div>
                </main>
                
            </div>
        </div>
    )
}