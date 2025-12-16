'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Info, Clock, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

function IconMath() {
  return (
    <svg
      className="w-6 h-6 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12h16M12 4v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function KraepelinInstructionPage() {
  const router = useRouter();
  const handleStart = () => {
    router.push('/tests/kraepelin/test');
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-red-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">Tes Kraepelin</h1>
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
                    <li className="font-medium text-slate-700">Kraepelin</li>
                  </ol>
                </nav>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                  Tes Kraepelin
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Tes ini digunakan untuk mengukur kecepatan, ketelitian, dan ketahanan
                  konsentrasi dengan melakukan penjumlahan angka secara berurutan dalam
                  batas waktu tertentu.
                </p>
              </div>

              {/* Info box */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Durasi</div>
                    <div className="text-slate-600">± 5–10 menit</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-amber-600">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Jumlah Lajur</div>
                    <div className="text-slate-600">Beberapa kolom angka vertikal</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="text-emerald-600">
                    <IconMath />
                  </div>
                  <div className="text-sm">
                    <div className="text-slate-800 font-medium">Tujuan</div>
                    <div className="text-slate-600">
                      Mengukur konsentrasi dan ketahanan kerja
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Petunjuk Pengerjaan */}
              <section className="mt-10 mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <ListChecks className="text-blue-600" size={22} />
                  Petunjuk Tes Kraepelin
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                    <li className="flex gap-3 items-start">
                      <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                      Anda akan melihat kolom berisi angka-angka vertikal.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                      Jumlahkan dua angka yang berdekatan secara vertikal.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                      Tuliskan <strong className="text-blue-600">digit terakhir</strong> hasil penjumlahan.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                      Setiap lajur memiliki batas waktu <strong className="text-blue-600">30 detik</strong>.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                      Setelah waktu habis, sistem akan berpindah otomatis ke lajur berikutnya.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="flex-none mt-1 w-2.5 h-2.5 bg-slate-400 rounded-full"></span>
                      Kerjakan secepat dan seakurat mungkin.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section: Contoh Soal */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contoh Soal</h2>
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-4">
                    Berikut contoh tampilan soal DISC. Pilih satu kata yang paling dan paling tidak menggambarkan diri Anda.
                  </p>
                  <div className="flex justify-center items-center bg-white rounded-lg p-8 border">
                    <span className="text-gray-400 italic">
                      (Contoh tampilan kelompok kata akan muncul di sini)
                    </span>
                  </div>
                </div>
              </section>

              {/* Tombol aksi */}
              <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-800">Sebelum mulai:</strong> pastikan Anda
                  fokus dan siap mengerjakan tanpa gangguan.
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
            Sistem akan otomatis memulai timer saat tes dimulai.
          </div>
          </motion.div>
      </main>
    </div>
  );
}
