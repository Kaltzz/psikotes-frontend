'use client';
import Link from 'next/link';
import { ArrowLeft, Brain, Clock, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CFITSubtest1() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">CFIT - Subtes 2: Series</h1>
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Section: Petunjuk */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <ListChecks className="text-blue-600" size={22} />
              Petunjuk Subtes 1
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                Pada subtes ini, Anda akan dihadapkan dengan rangkaian gambar yang membentuk suatu pola.
                Tugas Anda adalah:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Mengamati rangkaian gambar yang disajikan</li>
                <li>Menemukan pola atau hubungan antara gambar-gambar tersebut</li>
                <li>Memilih gambar yang tepat untuk melengkapi rangkaian tersebut</li>
                <li>
                  <Clock className="inline-block text-blue-500 mr-1" size={16} />
                  Waktu pengerjaan: <span className="font-semibold">3 menit</span>
                </li>
                <li>Jumlah soal: <span className="font-semibold">13 butir</span></li>
              </ul>
            </div>
          </section>

          {/* Section: Contoh Soal */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <p className="text-sm text-gray-600 mb-4">
                Perhatikan rangkaian gambar berikut dan tentukan gambar yang tepat untuk mengisi kotak terakhir:
              </p>
              <div className="flex justify-center items-center bg-white rounded-lg p-8 border">
                <span className="text-gray-400 italic">
                  (Contoh gambar soal akan ditampilkan di sini)
                </span>
              </div>
            </div>
          </section>

          {/* Section: Tombol Aksi */}
          <div className="text-center space-x-4">
            <Link href="/tests/cfit" className="inline-block">
              <button className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                Kembali
              </button>
            </Link>
            <Link href="/tests/cfit/subtest1/test" className="inline-block">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                Mulai Subtes 2
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © {new Date().getFullYear()} Psikotes Online • Kurniawan Group
      </footer>
    </div>
  );
}
