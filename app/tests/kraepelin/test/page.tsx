// // ======================================  PLAN C  ===============================================

// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// /* ═══════════════════════════════════════════════════════════
//    CONSTANTS & TYPES
//    ═══════════════════════════════════════════════════════════ */
// const ROWS = 60;
// const COLS = 40;
// const PAIRS = ROWS - 1; // 59 pasangan per kolom
// const COL_TIME_MS = 15_000; // 30 detik per kolom

// type Status = "idle" | "playing" | "finished";

// // Audit log — mencatat hanya anomali/pelanggaran
// interface AuditEntry {
//   timestamp: string;
//   event: "violation_same_column_backward" | "violation_same_column_forward" | "violation_different_column";
//   fromCol: number;
//   toCol: number;
//   fromPair: number;
//   toPair: number;
//   remainingTimeMs: number;
// }

// // State per kolom
// interface ColState {
//   hasStarted: boolean; // apakah kolom ini sudah pernah dikunjungi
//   timeLeftMs: number;
//   timedOut: boolean;
// }

// // State jawaban per lajur
// interface ColumnResult {
//   columnIndex: number;
//   answers: (1 | 0 | null)[];
//   correctCount: number;
//   wrongCount: number;
//   totalAnswered: number;
// }

// /* ═══════════════════════════════════════════════════════════
//    HELPERS
//    ═══════════════════════════════════════════════════════════ */
// function genGrid(): number[][] {
//   return Array.from({ length: ROWS }, () =>
//     Array.from({ length: COLS }, () => Math.floor(Math.random() * 9) + 1)
//   );
// }

// function initColStates(): ColState[] {
//   return Array.from({ length: COLS }, () => ({
//     hasStarted: false,
//     timeLeftMs: COL_TIME_MS,
//     timedOut: false,
//   }));
// }

// /* ═══════════════════════════════════════════════════════════
//    COMPONENT
//    ═══════════════════════════════════════════════════════════ */
// export default function KraeplinTest() {
//   const router = useRouter();
  
//   /* ── state ── */
//   const [grid, setGrid] = useState<number[][]>([]);
//   const [activeCol, setActiveCol] = useState<number>(0);
//   const [answers, setAnswers] = useState<(1 | 0 | null)[][]>(
//     () => Array.from({ length: COLS }, () => Array(PAIRS).fill(null))
//   );
//   const [colStates, setColStates] = useState<ColState[]>(initColStates);
//   const [status, setStatus] = useState<Status>("idle");
//   const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  
//   // Track input yang sedang fokus (col, pairIndex)
//   const [focusedInput, setFocusedInput] = useState<{col: number, pair: number} | null>(null);
  
//   const [isClient, setIsClient] = useState(false);
  
//   useEffect(() => {
//     setIsClient(true);
//     setGrid(genGrid());
//   }, []);

//   /* ── refs ── */
//   const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

//   /* ── derived ── */
//   const timeLeftMs = colStates[activeCol]?.timeLeftMs ?? COL_TIME_MS;

//   /* ═══ CALCULATE RESULTS PER COLUMN ═══ */
//   const calculateColumnResults = useCallback((): ColumnResult[] => {
//     const results: ColumnResult[] = [];
    
//     for (let c = 0; c < COLS; c++) {
//       let correctCount = 0;
//       let wrongCount = 0;
//       let totalAnswered = 0;
      
//       for (let r = 0; r < PAIRS; r++) {
//         if (answers[c][r] !== null) {
//           totalAnswered++;
//           if (answers[c][r] === 1) {
//             correctCount++;
//           } else {
//             wrongCount++;
//           }
//         }
//       }
      
//       results.push({
//         columnIndex: c,
//         answers: [...answers[c]],
//         correctCount,
//         wrongCount,
//         totalAnswered,
//       });
//     }
    
//     return results;
//   }, [answers]);

//   /* ═══ SUBMIT RESULTS TO BACKEND ═══ */
//   const handleSubmit = useCallback(async () => {
//     try {
//       const columnResults = calculateColumnResults();
      
//       const totalCorrect = columnResults.reduce((sum, col) => sum + col.correctCount, 0);
//       const totalWrong = columnResults.reduce((sum, col) => sum + col.wrongCount, 0);
//       const totalAnswered = columnResults.reduce((sum, col) => sum + col.totalAnswered, 0);
      
//       const payload = {
//         testType: "kraepelin",
//         columnResults,
//         summary: {
//           totalCorrect,
//           totalWrong,
//           totalAnswered,
//           accuracy: totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0,
//         },
//         auditLog,
//         completedAt: new Date().toISOString(),
//       };

//       await axios.post("/api/kraepelin/submit", payload);
//       router.push("/disc");
//     } catch (error) {
//       console.error("Error submitting Kraepelin test:", error);
//       router.push("/disc");
//     }
//   }, [calculateColumnResults, auditLog, router]);

//   /* ═══ TIMER - Hanya countdown kolom aktif ═══ */

//     useEffect(()=> {
//     console.log('ini answers: ', answers)
//   }, [answers])

//   useEffect(()=> {
//     console.log('ini auditLog: ', auditLog)
//   }, [auditLog])

//   useEffect(() => {
//     if (status !== "playing") return;

//     // Mark kolom aktif sebagai sudah dimulai
//     setColStates((prev) => {
//       const next = prev.map((cs) => ({ ...cs }));
//       if (!next[activeCol].hasStarted) {
//         next[activeCol].hasStarted = true;
//       }
//       return next;
//     });

//     const timerInterval = setInterval(() => {
//       setColStates((prev) => {
//         const next = prev.map((cs) => ({ ...cs }));
//         const cur = next[activeCol];
        
//         // Hanya countdown jika belum timeout
//         if (!cur.timedOut) {
//           cur.timeLeftMs -= 100;
          
//           if (cur.timeLeftMs <= 0) {
//             cur.timeLeftMs = 0;
//             cur.timedOut = true;
//           }
//         }
        
//         return next;
//       });
//     }, 100);

//     return () => clearInterval(timerInterval);
//   }, [status, activeCol]);

//   /* ═══ AUTO ADVANCE WHEN ACTIVE COLUMN TIMEOUT ═══ */
//   useEffect(() => {
//     if (status !== "playing") return;
    
//     const curState = colStates[activeCol];
//     if (!curState.timedOut) return;
    
//     // Waktu habis pada kolom aktif, pindah ke kolom berikutnya (ini normal, tidak dicatat)
//     if (activeCol < COLS - 1) {
//       const nextCol = activeCol + 1;
      
//       setActiveCol(nextCol);
      
//       // Auto-focus ke pair pertama (paling bawah) di kolom berikutnya
//       const nextPair = PAIRS - 1;
//       setFocusedInput({ col: nextCol, pair: nextPair });
      
//       setTimeout(() => {
//         const key = `${nextCol}-${nextPair}`;
//         inputRefs.current[key]?.focus();
//       }, 50);
      
//     } else {
//       // Semua kolom selesai
//       setStatus("finished");
//     }
//   }, [colStates, activeCol, status]);

//   /* ═══ HANDLE FINISHED ═══ */
//   useEffect(() => {
//     if (status === "finished") {
//       handleSubmit();
//     }
//   }, [status, handleSubmit]);

//   /* ═══ HANDLE INPUT - Digunakan saat user ketik angka ═══ */
//   const handleInput = useCallback((digit: number, col: number, pairIdx: number) => {
//     if (status !== "playing") return;
    
//     // Hitung jawaban yang benar
//     const top = grid[pairIdx][col];
//     const bottom = grid[pairIdx + 1][col];
//     const correctAnswer = (top + bottom) % 10;
//     const isCorrect = digit === correctAnswer;
    
//     // Update answers
//     setAnswers(prev => {
//       const next = prev.map(c => [...c]);
//       next[col][pairIdx] = isCorrect ? 1 : 0;
//       return next;
//     });
    
//     // Auto-focus ke input berikutnya (ke atas) - ini adalah alur normal
//     if (pairIdx > 0) {
//       const nextPair = pairIdx - 1;
//       setFocusedInput({ col, pair: nextPair });
      
//       // Focus ke input element
//       setTimeout(() => {
//         const key = `${col}-${nextPair}`;
//         inputRefs.current[key]?.focus();
//       }, 50);
//     }
//   }, [status, grid]);

//   /* ═══ HANDLE MANUAL CLICK - User klik input box di kolom/pair lain ═══ */
//   const handleInputClick = useCallback((col: number, pairIdx: number) => {
//     if (status !== "playing") return;
    
//     // Cek apakah sudah dijawab - jika sudah, tidak bisa diklik
//     if (answers[col][pairIdx] !== null) return;
    
//     const prevCol = activeCol;
//     const prevPair = focusedInput?.pair ?? PAIRS - 1;
    
//     // Deteksi anomali/pelanggaran
//     let isAnomaly = false;
//     let eventType: AuditEntry["event"] | null = null;
    
//     // Kasus 1: Pindah ke lajur berbeda (selalu anomali)
//     if (col !== activeCol) {
//       isAnomaly = true;
//       eventType = "violation_different_column";
//     }
//     // Kasus 2: Di lajur yang sama, tapi tidak mengikuti urutan normal (bawah ke atas)
//     else if (col === activeCol) {
//       // Normal flow: dari pair yang lebih besar (bawah) ke pair yang lebih kecil (atas)
//       // Anomali jika: pindah ke bawah (pairIdx > prevPair) atau loncat lebih dari 1 step
//       if (pairIdx > prevPair) {
//         isAnomaly = true;
//         eventType = "violation_same_column_backward"; // Kembali ke bawah
//       } else if (pairIdx < prevPair - 1) {
//         isAnomaly = true;
//         eventType = "violation_same_column_forward"; // Loncat ke atas (skip)
//       }
//     }
    
//     // Log hanya jika ada anomali
//     if (isAnomaly && eventType) {
//       setAuditLog(prev => [...prev, {
//         timestamp: new Date().toISOString(),
//         event: eventType,
//         fromCol: prevCol,
//         toCol: col,
//         fromPair: prevPair,
//         toPair: pairIdx,
//         remainingTimeMs: colStates[activeCol].timeLeftMs,
//       }]);
//     }
    
//     // Update active column jika berbeda
//     if (col !== activeCol) {
//       setActiveCol(col);
//     }
    
//     // Update focus
//     setFocusedInput({ col, pair: pairIdx });
//   }, [status, activeCol, focusedInput, colStates, answers]);

//   /* ═══ KEYBOARD LISTENER ═══ */
//   useEffect(() => {
//     if (status !== "playing" || !focusedInput) return;

//     const onKey = (e: KeyboardEvent) => {
//       if (e.key >= "0" && e.key <= "9") {
//         e.preventDefault();
//         handleInput(Number(e.key), focusedInput.col, focusedInput.pair);
//       }
//     };

//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [status, focusedInput, handleInput]);

//   /* ═══ START TEST ═══ */
//   const startTest = () => {
//     setGrid(genGrid());
//     setAnswers(Array.from({ length: COLS }, () => Array(PAIRS).fill(null)));
//     setColStates(initColStates());
//     setActiveCol(0);
//     setAuditLog([]);
//     setFocusedInput({ col: 0, pair: PAIRS - 1 }); // Mulai dari pair paling bawah
//     setStatus("playing");
    
//     // Auto-focus ke input pertama
//     setTimeout(() => {
//       const key = `0-${PAIRS - 1}`;
//       inputRefs.current[key]?.focus();
//     }, 100);
//   };

//   /* ═══════════════════════════════════════════════════════════
//      RENDER
//      ═══════════════════════════════════════════════════════════ */
  
//   if (!isClient || grid.length === 0) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-stone-100">
//         <div className="text-stone-400 text-sm">Memuat tes...</div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="w-screen h-screen flex flex-col bg-stone-100 select-none overflow-hidden">

//       {/* ── TOP BAR ── */}
//       <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-stone-200 bg-white">
//         <h1 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
//           Tes Kraepelin
//         </h1>
//         {status === "playing" && (
//           <div className="text-xs text-stone-500">
//             Lajur: <span className="font-bold text-blue-600">{activeCol + 1}</span>/{COLS} 
//             {" · "}
//             Waktu: <span className="font-mono font-bold">{Math.ceil(timeLeftMs / 1000)}s</span>
//           </div>
//         )}
//       </div>

//       {/* ── MAIN AREA ── */}
//       <div className="flex-1 flex overflow-hidden min-h-0">

//         {/* ─── GRID AREA ─── */}
//         <div className="flex-1 overflow-auto p-3">
//           <div className="flex gap-3 w-max">
//             {grid[0].map((_, cIdx) => {
//               const isActiveCol = cIdx === activeCol;
//               const isTimedOut = colStates[cIdx].timedOut;

//               return (
//                 <div
//                   key={cIdx}
//                   className={[
//                     "rounded-lg p-3 transition-all",
//                     isActiveCol 
//                       ? "bg-blue-50 ring-2 ring-blue-400 shadow-lg" 
//                       : isTimedOut
//                         ? "bg-stone-100 opacity-60"
//                         : "bg-white",
//                   ].join(" ")}
//                 >
//                   {/* Header lajur */}
                  
//                   <div className="text-center mb-2 pb-2 border-b border-stone-200">
//                     <div className="text-[10px] text-stone-400 font-medium">LAJUR</div>
//                     <div className="text-sm font-bold text-stone-600">{cIdx + 1}</div>
//                     {!isTimedOut && (
//                       <div className="text-[10px] text-stone-400 font-mono mt-0.5">
//                         {Math.ceil(colStates[cIdx].timeLeftMs / 1000)}s
//                       </div>
//                     )}
//                     {isTimedOut && (
//                       <div className="text-[10px] text-red-500 font-semibold mt-0.5">
//                         SELESAI
//                       </div>
//                     )}
//                   </div>

//                   {/* 2 Kolom Layout: Soal | Jawaban */}
//                   <div className="flex gap-2">
//                     {/* Kolom Soal (Kiri) */}
//                     <div className="flex flex-col-reverse gap-0">
//                       {Array.from({ length: PAIRS }).map((_, pairIdx) => {
//                         const actualPairIdx = PAIRS - 1 - pairIdx;
//                         const topRowIdx = actualPairIdx;
//                         const bottomRowIdx = actualPairIdx + 1;
                        
//                         const topNum = grid[topRowIdx][cIdx];
//                         const bottomNum = grid[bottomRowIdx][cIdx];
                        
//                         return (
//                           <div key={actualPairIdx} className="flex flex-col">
//                             {/* Top number */}
//                             <div className="w-10 h-6 flex items-center justify-center text-sm font-medium text-stone-700 bg-stone-50 border-b border-stone-200">
//                               {topNum}
//                             </div>
//                             {/* Bottom number */}
//                             <div className="w-10 h-6 flex items-center justify-center text-sm font-medium text-stone-700 bg-stone-50 border-b-2 border-stone-300">
//                               {bottomNum}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {/* Kolom Jawaban (Kanan) */}
//                     <div className="flex flex-col-reverse gap-0">
//                       {Array.from({ length: PAIRS }).map((_, pairIdx) => {
//                         const actualPairIdx = PAIRS - 1 - pairIdx;
//                         const answer = answers[cIdx][actualPairIdx];
//                         const isFocused = focusedInput?.col === cIdx && focusedInput?.pair === actualPairIdx;
                        
//                         return (
//                           <div key={actualPairIdx} className="h-12 flex items-center">
//                             {/* Input box - sejajar dengan tengah 2 angka */}
//                             <input
//                               ref={el => { inputRefs.current[`${cIdx}-${actualPairIdx}`] = el; }}
//                               type="text"
//                               maxLength={1}
//                               value=""
//                               onClick={() => handleInputClick(cIdx, actualPairIdx)}
//                               onFocus={() => handleInputClick(cIdx, actualPairIdx)}
//                               onChange={(e) => {
//                                 const val = e.target.value;
//                                 if (val >= "0" && val <= "9") {
//                                   handleInput(Number(val), cIdx, actualPairIdx);
//                                 }
//                               }}
//                               className={[
//                                 "w-10 h-8 text-center text-sm font-bold rounded border-2 transition-all outline-none",
//                                 answer !== null
//                                   ? "border-stone-300 bg-stone-100 text-stone-400 cursor-not-allowed"
//                                   : isFocused 
//                                     ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300 scale-105" 
//                                     : "border-stone-300 bg-white hover:border-blue-400",
//                               ].join(" ")}
//                               placeholder={answer !== null ? "✓" : "?"}
//                               disabled={status !== "playing" || isTimedOut || answer !== null}
//                             />
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ─── RIGHT PANEL ─── */}
//         <div className="w-52 shrink-0 border-l border-stone-200 bg-white flex flex-col items-center justify-center gap-5 px-4">

//           {/* ── IDLE: Start ── */}
//           {status === "idle" && (
//             <div className="flex flex-col items-center gap-4 w-full">
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
//                 <p className="text-stone-600 text-xs leading-relaxed">
//                   • Klik kotak jawaban untuk mulai<br />
//                   • Gunakan angka <span className="font-semibold">0–9</span><br />
//                   • Waktu: <span className="font-semibold">30 detik</span> per lajur<br />
//                   • Otomatis pindah saat waktu habis
//                 </p>
//               </div>
//               <button
//                 onClick={startTest}
//                 className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-lg shadow-lg transition-all duration-150 hover:shadow-xl"
//               >
//                 Mulai Tes
//               </button>
//             </div>
//           )}

//           {/* ── PLAYING: Numpad ── */}
//           {status === "playing" && (
//             <>
//               {/* Info */}
//               <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 w-full">
//                 <div className="text-[10px] text-stone-400 font-medium mb-1">FOKUS SAAT INI</div>
//                 <div className="text-sm text-stone-700">
//                   Lajur <span className="font-bold text-blue-600">{(focusedInput?.col ?? 0) + 1}</span>
//                   {focusedInput && (
//                     <span className="text-stone-400 text-xs ml-1">
//                       · Soal {PAIRS - focusedInput.pair}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Numpad */}
//               <div className="grid grid-cols-3 gap-1.5 w-full">
//                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => {
//                       if (focusedInput) {
//                         handleInput(n, focusedInput.col, focusedInput.pair);
//                       }
//                     }}
//                     disabled={!focusedInput}
//                     className="bg-white border-2 border-stone-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 text-stone-700 font-bold text-lg rounded-lg shadow-sm transition-all duration-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
//                     style={{ height: "3.25rem" }}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>

//               <div className="text-[10px] text-stone-400 text-center leading-relaxed">
//                 Klik kotak untuk pindah soal<br />
//                 <span className="text-red-500 font-semibold">Pelanggaran tercatat!</span>
//               </div>
//             </>
//           )}

//           {/* ── FINISHED ── */}
//           {status === "finished" && (
//             <div className="flex flex-col items-center gap-4 w-full">
//               <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 w-full text-center">
//                 <p className="text-sm text-stone-500">Mengirim hasil tes...</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// =============================================================================================================================================

// ======================================  PLAN C - REVISED  ===============================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & TYPES
   ═══════════════════════════════════════════════════════════ */
const ROWS = 60;
const COLS = 40;
const PAIRS = ROWS - 1; // 59 pasangan per kolom
const COL_TIME_MS = 15_000; // 15 detik per kolom

type Status = "idle" | "playing" | "finished";

// Audit log — mencatat hanya anomali/pelanggaran
interface AuditEntry {
  timestamp: string;
  event: "violation_same_column_backward" | "violation_same_column_forward" | "violation_different_column";
  fromCol: number;
  toCol: number;
  fromPair: number;
  toPair: number;
  remainingTimeMs: number;
}

// State per kolom
interface ColState {
  hasStarted: boolean; // apakah kolom ini sudah pernah dikunjungi
  timeLeftMs: number;
  timedOut: boolean;
}

// State jawaban per lajur
interface ColumnResult {
  columnIndex: number;
  answers: (1 | 0 | null)[];
  correctCount: number;
  wrongCount: number;
  totalAnswered: number;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
function genGrid(): number[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.floor(Math.random() * 9) + 1)
  );
}

function initColStates(): ColState[] {
  return Array.from({ length: COLS }, () => ({
    hasStarted: false,
    timeLeftMs: COL_TIME_MS,
    timedOut: false,
  }));
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function KraeplinTest() {
  const router = useRouter();
  
  /* ── state ── */
  const [grid, setGrid] = useState<number[][]>([]);
  
  // REVISI 2: systemActiveCol adalah kolom yang seharusnya aktif menurut sistem (untuk timer)
  const [systemActiveCol, setSystemActiveCol] = useState<number>(0);
  
  // activeCol adalah kolom yang sedang dikerjakan user (bisa berbeda jika user loncat manual)
  const [activeCol, setActiveCol] = useState<number>(0);
  
  const [answers, setAnswers] = useState<(1 | 0 | null)[][]>(
    () => Array.from({ length: COLS }, () => Array(PAIRS).fill(null))
  );
  const [colStates, setColStates] = useState<ColState[]>(initColStates);
  const [status, setStatus] = useState<Status>("idle");
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  
  // Track input yang sedang fokus (col, pairIndex)
  const [focusedInput, setFocusedInput] = useState<{col: number, pair: number} | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    setGrid(genGrid());
  }, []);

  /* ── refs ── */
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  /* ── derived ── */
  // REVISI 2: Waktu yang ditampilkan mengikuti systemActiveCol, bukan activeCol
  const timeLeftMs = colStates[systemActiveCol]?.timeLeftMs ?? COL_TIME_MS;

  /* ═══ CALCULATE RESULTS PER COLUMN ═══ */
  const calculateColumnResults = useCallback((): ColumnResult[] => {
    const results: ColumnResult[] = [];
    
    for (let c = 0; c < COLS; c++) {
      let correctCount = 0;
      let wrongCount = 0;
      let totalAnswered = 0;
      
      for (let r = 0; r < PAIRS; r++) {
        if (answers[c][r] !== null) {
          totalAnswered++;
          if (answers[c][r] === 1) {
            correctCount++;
          } else {
            wrongCount++;
          }
        }
      }
      
      results.push({
        columnIndex: c,
        answers: [...answers[c]],
        correctCount,
        wrongCount,
        totalAnswered,
      });
    }
    
    return results;
  }, [answers]);

  /* ═══ SUBMIT RESULTS TO BACKEND ═══ */
  const handleSubmit = useCallback(async () => {
    try {
      const columnResults = calculateColumnResults();
      
      const totalCorrect = columnResults.reduce((sum, col) => sum + col.correctCount, 0);
      const totalWrong = columnResults.reduce((sum, col) => sum + col.wrongCount, 0);
      const totalAnswered = columnResults.reduce((sum, col) => sum + col.totalAnswered, 0);
      
      const payload = {
        testType: "kraepelin",
        columnResults,
        summary: {
          totalCorrect,
          totalWrong,
          totalAnswered,
          accuracy: totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0,
        },
        auditLog,
        completedAt: new Date().toISOString(),
      };

      await axios.post("/api/kraepelin/submit", payload);
      router.push("/disc");
    } catch (error) {
      console.error("Error submitting Kraepelin test:", error);
      router.push("/disc");
    }
  }, [calculateColumnResults, auditLog, router]);

  /* ═══ TIMER - REVISI 2: Countdown mengikuti systemActiveCol ═══ */

    useEffect(()=> {
    console.log('ini answers: ', answers)
  }, [answers])

  useEffect(()=> {
    console.log('ini auditLog: ', auditLog)
  }, [auditLog])

  useEffect(() => {
    if (status !== "playing") return;

    // Mark kolom sistem sebagai sudah dimulai
    setColStates((prev) => {
      const next = prev.map((cs) => ({ ...cs }));
      if (!next[systemActiveCol].hasStarted) {
        next[systemActiveCol].hasStarted = true;
      }
      return next;
    });

    const timerInterval = setInterval(() => {
      setColStates((prev) => {
        const next = prev.map((cs) => ({ ...cs }));
        const cur = next[systemActiveCol]; // REVISI 2: Mengikuti systemActiveCol
        
        // Hanya countdown jika belum timeout
        if (!cur.timedOut) {
          cur.timeLeftMs -= 100;
          
          if (cur.timeLeftMs <= 0) {
            cur.timeLeftMs = 0;
            cur.timedOut = true;
          }
        }
        
        return next;
      });
    }, 100);

    return () => clearInterval(timerInterval);
  }, [status, systemActiveCol]); // REVISI 2: dependency berubah ke systemActiveCol

  /* ═══ AUTO ADVANCE WHEN SYSTEM COLUMN TIMEOUT ═══ */
  useEffect(() => {
    if (status !== "playing") return;
    
    const curState = colStates[systemActiveCol]; // REVISI 2: Cek systemActiveCol
    if (!curState.timedOut) return;
    
    // Waktu habis pada kolom sistem, pindah ke kolom berikutnya (ini normal, tidak dicatat)
    if (systemActiveCol < COLS - 1) {
      const nextCol = systemActiveCol + 1;
      
      setSystemActiveCol(nextCol); // REVISI 2: Update systemActiveCol
      setActiveCol(nextCol); // Update activeCol juga agar sinkron
      
      // Auto-focus ke pair pertama (paling bawah) di kolom berikutnya
      const nextPair = PAIRS - 1;
      setFocusedInput({ col: nextCol, pair: nextPair });
      
      setTimeout(() => {
        const key = `${nextCol}-${nextPair}`;
        inputRefs.current[key]?.focus();
      }, 50);
      
    } else {
      // Semua kolom selesai
      setStatus("finished");
    }
  }, [colStates, systemActiveCol, status]); // REVISI 2: dependency berubah

  /* ═══ HANDLE FINISHED ═══ */
  useEffect(() => {
    if (status === "finished") {
      handleSubmit();
    }
  }, [status, handleSubmit]);

  /* ═══ HANDLE INPUT - Digunakan saat user ketik angka ═══ */
  const handleInput = useCallback((digit: number, col: number, pairIdx: number) => {
    if (status !== "playing") return;
    
    // Hitung jawaban yang benar
    const top = grid[pairIdx][col];
    const bottom = grid[pairIdx + 1][col];
    const correctAnswer = (top + bottom) % 10;
    const isCorrect = digit === correctAnswer;
    
    // Update answers
    setAnswers(prev => {
      const next = prev.map(c => [...c]);
      next[col][pairIdx] = isCorrect ? 1 : 0;
      return next;
    });
    
    // Auto-focus ke input berikutnya (ke atas) - ini adalah alur normal
    if (pairIdx > 0) {
      const nextPair = pairIdx - 1;
      setFocusedInput({ col, pair: nextPair });
      
      // Focus ke input element
      setTimeout(() => {
        const key = `${col}-${nextPair}`;
        inputRefs.current[key]?.focus();
      }, 50);
    }
  }, [status, grid]);

  /* ═══ HANDLE MANUAL CLICK - User klik input box di kolom/pair lain ═══ */
  const handleInputClick = useCallback((col: number, pairIdx: number) => {
    if (status !== "playing") return;
    
    // REVISI 1: Hanya cek apakah sudah dijawab - tetap bisa klik kotak kosong di lajur manapun
    if (answers[col][pairIdx] !== null) return;
    
    const prevCol = activeCol;
    const prevPair = focusedInput?.pair ?? PAIRS - 1;
    
    // Deteksi anomali/pelanggaran
    let isAnomaly = false;
    let eventType: AuditEntry["event"] | null = null;
    
    // Kasus 1: Pindah ke lajur berbeda (selalu anomali)
    if (col !== activeCol) {
      isAnomaly = true;
      eventType = "violation_different_column";
    }
    // Kasus 2: Di lajur yang sama, tapi tidak mengikuti urutan normal (bawah ke atas)
    else if (col === activeCol) {
      // Normal flow: dari pair yang lebih besar (bawah) ke pair yang lebih kecil (atas)
      // Anomali jika: pindah ke bawah (pairIdx > prevPair) atau loncat lebih dari 1 step
      if (pairIdx > prevPair) {
        isAnomaly = true;
        eventType = "violation_same_column_backward"; // Kembali ke bawah
      } else if (pairIdx < prevPair - 1) {
        isAnomaly = true;
        eventType = "violation_same_column_forward"; // Loncat ke atas (skip)
      }
    }
    
    // Log hanya jika ada anomali
    if (isAnomaly && eventType) {
      setAuditLog(prev => [...prev, {
        timestamp: new Date().toISOString(),
        event: eventType,
        fromCol: prevCol,
        toCol: col,
        fromPair: prevPair,
        toPair: pairIdx,
        remainingTimeMs: colStates[systemActiveCol].timeLeftMs, // REVISI 2: menggunakan systemActiveCol
      }]);
    }
    
    // Update active column jika berbeda (tapi TIDAK update systemActiveCol)
    // REVISI 2: systemActiveCol tetap mengikuti urutan sistem
    if (col !== activeCol) {
      setActiveCol(col);
    }
    
    // Update focus
    setFocusedInput({ col, pair: pairIdx });
  }, [status, activeCol, focusedInput, colStates, systemActiveCol, answers]); // REVISI 2: tambah systemActiveCol

  /* ═══ KEYBOARD LISTENER ═══ */
  useEffect(() => {
    if (status !== "playing" || !focusedInput) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleInput(Number(e.key), focusedInput.col, focusedInput.pair);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, focusedInput, handleInput]);

  /* ═══ START TEST ═══ */
  const startTest = () => {
    setGrid(genGrid());
    setAnswers(Array.from({ length: COLS }, () => Array(PAIRS).fill(null)));
    setColStates(initColStates());
    setActiveCol(0);
    setSystemActiveCol(0); // REVISI 2: reset systemActiveCol juga
    setAuditLog([]);
    setFocusedInput({ col: 0, pair: PAIRS - 1 }); // Mulai dari pair paling bawah
    setStatus("playing");
    
    // Auto-focus ke input pertama
    setTimeout(() => {
      const key = `0-${PAIRS - 1}`;
      inputRefs.current[key]?.focus();
    }, 100);
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  
  if (!isClient || grid.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-stone-100">
        <div className="text-stone-400 text-sm">Memuat tes...</div>
      </div>
    );
  }
  
  return (
    <div className="w-screen h-screen flex flex-col bg-stone-100 select-none overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-stone-200 bg-white">
        <h1 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
          Tes Kraepelin
        </h1>
        {status === "playing" && (
          <div className="text-xs text-stone-500">
            {/* REVISI 2: Tampilkan systemActiveCol sebagai lajur sistem */}
            Lajur Sistem: <span className="font-bold text-blue-600">{systemActiveCol + 1}</span>/{COLS} 
            {activeCol !== systemActiveCol && (
              <span className="text-red-500 font-semibold ml-2">
                (Anda di Lajur {activeCol + 1})
              </span>
            )}
            {" · "}
            Waktu: <span className="font-mono font-bold">{Math.ceil(timeLeftMs / 1000)}s</span>
          </div>
        )}
      </div>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ─── GRID AREA ─── */}
        <div className="flex-1 overflow-auto p-3">
          <div className="flex gap-3 w-max">
            {grid[0].map((_, cIdx) => {
              const isActiveCol = cIdx === activeCol;
              const isSystemActiveCol = cIdx === systemActiveCol; // REVISI 2: track kolom sistem
              const isTimedOut = colStates[cIdx].timedOut;

              return (
                <div
                  key={cIdx}
                  className={[
                    "rounded-lg p-3 transition-all",
                    isSystemActiveCol 
                      ? "bg-blue-50 ring-2 ring-blue-400 shadow-lg" 
                      : isActiveCol && !isSystemActiveCol
                        ? "bg-yellow-50 ring-2 ring-yellow-400 shadow-lg" // REVISI 2: beda warna jika user loncat manual
                        : isTimedOut
                          ? "bg-stone-100 opacity-60"
                          : "bg-white",
                  ].join(" ")}
                >
                  {/* Header lajur */}
                  
                  <div className="text-center mb-2 pb-2 border-b border-stone-200">
                    <div className="text-[10px] text-stone-400 font-medium">LAJUR</div>
                    <div className="text-sm font-bold text-stone-600">{cIdx + 1}</div>
                    {!isTimedOut && (
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        {Math.ceil(colStates[cIdx].timeLeftMs / 1000)}s
                      </div>
                    )}
                    {isTimedOut && (
                      <div className="text-[10px] text-red-500 font-semibold mt-0.5">
                        SELESAI
                      </div>
                    )}
                  </div>

                  {/* 2 Kolom Layout: Soal | Jawaban */}
                  <div className="flex gap-2">
                    {/* Kolom Soal (Kiri) */}
                    <div className="flex flex-col-reverse gap-0">
                      {Array.from({ length: PAIRS }).map((_, pairIdx) => {
                        const actualPairIdx = PAIRS - 1 - pairIdx;
                        const topRowIdx = actualPairIdx;
                        const bottomRowIdx = actualPairIdx + 1;
                        
                        const topNum = grid[topRowIdx][cIdx];
                        const bottomNum = grid[bottomRowIdx][cIdx];
                        
                        return (
                          <div key={actualPairIdx} className="flex flex-col">
                            {/* Top number */}
                            <div className="w-10 h-6 flex items-center justify-center text-sm font-medium text-stone-700 bg-stone-50 border-b border-stone-200">
                              {topNum}
                            </div>
                            {/* Bottom number */}
                            <div className="w-10 h-6 flex items-center justify-center text-sm font-medium text-stone-700 bg-stone-50 border-b-2 border-stone-300">
                              {bottomNum}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Kolom Jawaban (Kanan) */}
                    <div className="flex flex-col-reverse gap-0">
                      {Array.from({ length: PAIRS }).map((_, pairIdx) => {
                        const actualPairIdx = PAIRS - 1 - pairIdx;
                        const answer = answers[cIdx][actualPairIdx];
                        const isFocused = focusedInput?.col === cIdx && focusedInput?.pair === actualPairIdx;
                        
                        return (
                          <div key={actualPairIdx} className="h-12 flex items-center">
                            {/* Input box - sejajar dengan tengah 2 angka */}
                            <input
                              ref={el => { inputRefs.current[`${cIdx}-${actualPairIdx}`] = el; }}
                              type="text"
                              maxLength={1}
                              value=""
                              onClick={() => handleInputClick(cIdx, actualPairIdx)}
                              onFocus={() => handleInputClick(cIdx, actualPairIdx)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val >= "0" && val <= "9") {
                                  handleInput(Number(val), cIdx, actualPairIdx);
                                }
                              }}
                              className={[
                                "w-10 h-8 text-center text-sm font-bold rounded border-2 transition-all outline-none",
                                answer !== null
                                  ? "border-stone-300 bg-stone-100 text-stone-400 cursor-not-allowed"
                                  : isFocused 
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300 scale-105" 
                                    : "border-stone-300 bg-white hover:border-blue-400",
                              ].join(" ")}
                              placeholder={answer !== null ? "✓" : "?"}
                              // REVISI 1: disabled hanya jika sudah dijawab atau status bukan playing
                              // Tidak lagi disabled berdasarkan isTimedOut
                              disabled={status !== "playing" || answer !== null}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="w-52 shrink-0 border-l border-stone-200 bg-white flex flex-col items-center justify-center gap-5 px-4">

          {/* ── IDLE: Start ── */}
          {status === "idle" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <p className="text-stone-600 text-xs leading-relaxed">
                  • Klik kotak jawaban untuk mulai<br />
                  • Gunakan angka <span className="font-semibold">0–9</span><br />
                  • Waktu: <span className="font-semibold">15 detik</span> per lajur<br />
                  • Otomatis pindah saat waktu habis<br />
                  • Kotak yang sudah diisi tidak bisa diubah
                </p>
              </div>
              <button
                onClick={startTest}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-lg shadow-lg transition-all duration-150 hover:shadow-xl"
              >
                Mulai Tes
              </button>
            </div>
          )}

          {/* ── PLAYING: Numpad ── */}
          {status === "playing" && (
            <>
              {/* Info */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 w-full">
                <div className="text-[10px] text-stone-400 font-medium mb-1">FOKUS SAAT INI</div>
                <div className="text-sm text-stone-700">
                  Lajur <span className="font-bold text-blue-600">{(focusedInput?.col ?? 0) + 1}</span>
                  {focusedInput && (
                    <span className="text-stone-400 text-xs ml-1">
                      · Soal {PAIRS - focusedInput.pair}
                    </span>
                  )}
                </div>
                {/* REVISI 2: Tampilkan peringatan jika user tidak di lajur sistem */}
                {activeCol !== systemActiveCol && (
                  <div className="text-[10px] text-red-500 font-semibold mt-2">
                    ⚠ Anda tidak di lajur sistem!
                  </div>
                )}
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-1.5 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      if (focusedInput) {
                        handleInput(n, focusedInput.col, focusedInput.pair);
                      }
                    }}
                    disabled={!focusedInput}
                    className="bg-white border-2 border-stone-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 text-stone-700 font-bold text-lg rounded-lg shadow-sm transition-all duration-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ height: "3.25rem" }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-stone-400 text-center leading-relaxed">
                Klik kotak untuk pindah soal<br />
                <span className="text-red-500 font-semibold">Pelanggaran tercatat!</span>
              </div>
            </>
          )}

          {/* ── FINISHED ── */}
          {status === "finished" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 w-full text-center">
                <p className="text-sm text-stone-500">Mengirim hasil tes...</p>
                <div className="mt-3 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// =====================================================================================================



// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// /* ═══════════════════════════════════════════════════════════
//    CONSTANTS & TYPES
//    ═══════════════════════════════════════════════════════════ */
// const ROWS = 60;
// const COLS = 40;
// const PAIRS = ROWS - 1; // 59 pasangan per kolom
// const COL_TIME_MS = 30_000; // 30 detik per kolom

// type Status = "idle" | "playing" | "finished";

// // Audit log — hanya di state, tidak ditampilkan di UI
// interface AuditEntry {
//   timestamp: string; // Ubah ke string untuk menghindari hydration error
//   event: "back_navigate" | "forward_navigate" | "answer_after_timeout" | "answer_in_reviewed_column";
//   fromCol: number;
//   toCol: number;
//   pairsAnsweredInFromCol: number;
//   remainingTimeMs: number;
//   reviewAnswer?: { // Jawaban yang diberikan saat review (tidak tersimpan di answers)
//     pairIndex: number;
//     digit: number;
//     isCorrect: boolean;
//   };
// }

// // State per kolom — untuk timer & posisi pair
// interface ColState {
//   pairIndex: number;   // pair aktif di kolom ini (bottom-up: mulai PAIRS-1 turun ke 0)
//   timeLeftMs: number;  // sisa waktu
//   timedOut: boolean;   // true kalau waktu sudah habis
// }

// // State jawaban per lajur dengan rincian benar/salah
// interface ColumnResult {
//   columnIndex: number;
//   answers: (1 | 0 | null)[]; // 1 = benar, 0 = salah, null = tidak dijawab
//   correctCount: number;
//   wrongCount: number;
//   totalAnswered: number;
// }

// /* ═══════════════════════════════════════════════════════════
//    HELPERS
//    ═══════════════════════════════════════════════════════════ */
// function genGrid(): number[][] {
//   return Array.from({ length: ROWS }, () =>
//     Array.from({ length: COLS }, () => Math.floor(Math.random() * 9) + 1)
//   );
// }

// function initColStates(): ColState[] {
//   return Array.from({ length: COLS }, () => ({
//     pairIndex: PAIRS - 1,
//     timeLeftMs: COL_TIME_MS,
//     timedOut: false,
//   }));
// }

// /* ═══════════════════════════════════════════════════════════
//    COMPONENT
//    ═══════════════════════════════════════════════════════════ */
// export default function KraeplinTest() {
//   const router = useRouter();
  
//   /* ── state ── */
//   // Fix hydration: grid dimulai dengan array kosong, baru di-generate di client
//   const [grid, setGrid] = useState<number[][]>([]);
//   const [activeCol, setActiveCol] = useState<number>(0);
//   // answers: menyimpan 1 (benar) atau 0 (salah), null jika belum dijawab
//   const [answers, setAnswers] = useState<(1 | 0 | null)[][]>(
//     () => Array.from({ length: COLS }, () => Array(PAIRS).fill(null))
//   );
//   const [colStates, setColStates] = useState<ColState[]>(initColStates);
//   const [status, setStatus] = useState<Status>("idle");
//   const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

//   // Audit log — tercatat di state, tidak tampil di UI
//   const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  
//   // Track kolom yang sudah pernah di-review (dikunjungi kembali)
//   const [reviewedCols, setReviewedCols] = useState<Set<number>>(new Set());
  
//   // Fix hydration: generate grid hanya di client side
//   const [isClient, setIsClient] = useState(false);
  
//   useEffect(() => {
//     setIsClient(true);
//     setGrid(genGrid());
//   }, []);

//   /* ── refs ── */
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const activeCellRef = useRef<HTMLDivElement | null>(null);
//   const bottomRef = useRef<HTMLDivElement | null>(null);
//   const isAdvancingRef = useRef<boolean>(false); // Flag untuk mencegah double advance

//   /* ── derived ── */
//   const currentPair = colStates[activeCol]?.pairIndex ?? PAIRS - 1;
//   const timeLeftMs = colStates[activeCol]?.timeLeftMs ?? COL_TIME_MS;
//   const isCurrentColTimedOut = colStates[activeCol]?.timedOut ?? false;

//   /* ═══ CALCULATE RESULTS PER COLUMN ═══ */
//   const calculateColumnResults = useCallback((): ColumnResult[] => {
//     const results: ColumnResult[] = [];
    
//     for (let c = 0; c < COLS; c++) {
//       let correctCount = 0;
//       let wrongCount = 0;
//       let totalAnswered = 0;
      
//       for (let r = 0; r < PAIRS; r++) {
//         if (answers[c][r] !== null) {
//           totalAnswered++;
//           if (answers[c][r] === 1) {
//             correctCount++;
//           } else {
//             wrongCount++;
//           }
//         }
//       }
      
//       results.push({
//         columnIndex: c,
//         answers: [...answers[c]],
//         correctCount,
//         wrongCount,
//         totalAnswered,
//       });
//     }
    
//     return results;
//   }, [answers]);

//   /* ═══ SUBMIT RESULTS TO BACKEND ═══ */
//   const handleSubmit = useCallback(async () => {
//     try {
//       const columnResults = calculateColumnResults();
      
//       // Total score
//       const totalCorrect = columnResults.reduce((sum, col) => sum + col.correctCount, 0);
//       const totalWrong = columnResults.reduce((sum, col) => sum + col.wrongCount, 0);
//       const totalAnswered = columnResults.reduce((sum, col) => sum + col.totalAnswered, 0);
      
//       const payload = {
//         testType: "kraepelin",
//         columnResults,
//         summary: {
//           totalCorrect,
//           totalWrong,
//           totalAnswered,
//           accuracy: totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0,
//         },
//         auditLog,
//         completedAt: new Date().toISOString(),
//       };

//       // Sesuaikan URL dengan endpoint backend Anda
//       await axios.post("/api/kraepelin/submit", payload);
      
//       // Redirect ke halaman DISC
//       router.push("/disc");
//     } catch (error) {
//       console.error("Error submitting Kraepelin test:", error);
//       // Tetap redirect meskipun submit gagal
//       router.push("/disc");
//     }
//   }, [calculateColumnResults, auditLog, router]);

//   useEffect(()=> {
//     console.log('ini answers: ', answers)
//   }, [answers])

//   useEffect(()=> {
//     console.log('ini auditLog: ', auditLog)
//   }, [auditLog])

//   /* ═══ TIMER ═══
//      - Tick setiap 100ms pada kolom aktif yang belum timed-out.
//      - Kalau user balik ke kolom yang sudah timed-out → tidak ada countdown.
//      - Waktu habis → timedOut = true → auto-advance ke kolom berikutnya.
//   */
//   useEffect(() => {
//     if (status !== "playing") {
//       if (timerRef.current) clearInterval(timerRef.current);
//       return;
//     }

//     timerRef.current = setInterval(() => {
//       setColStates((prev) => {
//         const next = prev.map((cs) => ({ ...cs }));
//         const cur = next[activeCol];

//         if (cur.timedOut) return prev; // sudah habis, skip

//         cur.timeLeftMs -= 100;

//         if (cur.timeLeftMs <= 0) {
//           cur.timeLeftMs = 0;
//           cur.timedOut = true;
//         }

//         return next;
//       });
//     }, 100);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [status, activeCol]);

//   /* ═══ HANDLE TIMEOUT - Pindah ke kolom berikutnya ═══ */
//   useEffect(() => {
//     if (status !== "playing") return;
    
//     const currentColState = colStates[activeCol];
    
//     // Cek apakah kolom aktif sudah timeout dan belum pernah di-advance
//     if (currentColState?.timedOut && !isAdvancingRef.current) {
//       isAdvancingRef.current = true;
      
//       // Pindah ke kolom berikutnya
//       if (activeCol < COLS - 1) {
//         setActiveCol(activeCol + 1);
//       } else {
//         // Kolom terakhir habis → test selesai
//         setStatus("finished");
//       }
      
//       // Reset flag setelah state update
//       setTimeout(() => {
//         isAdvancingRef.current = false;
//       }, 50);
//     }
//   }, [status, activeCol, colStates]);

//   /* ═══ AUTO-SCROLL ke pair aktif ═══ */
//   useEffect(() => {
//     activeCellRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
//   }, [activeCol, currentPair]);

//   /* ═══ SCROLL KE BAWAH saat mulai tes ═══ */
//   useEffect(() => {
//     if (status === "playing" && bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
//     }
//   }, [status]);

//   /* ═══ AUTO SUBMIT saat tes selesai ═══ */
//   useEffect(() => {
//     if (status === "finished") {
//       handleSubmit();
//     }
//   }, [status, handleSubmit]);

//   /* ═══ FEEDBACK flash (350ms) ═══ */
//   useEffect(() => {
//     if (!feedback) return;
//     const t = setTimeout(() => setFeedback(null), 350);
//     return () => clearTimeout(t);
//   }, [feedback]);

//   /* ═══ ADVANCE PAIR (turun, bottom-up) ═══ */
//   const advancePair = useCallback(() => {
//     setColStates((prev) => {
//       const next = prev.map((cs) => ({ ...cs }));
//       const cur = next[activeCol];
//       if (cur.pairIndex > 0) {
//         cur.pairIndex -= 1;
//       }
//       return next;
//     });
//   }, [activeCol]);

//   /* ═══ HANDLE INPUT (dari numpad atau keyboard) ═══ */
//   const handleInput = useCallback((digit: number) => {
//     if (status !== "playing") return;

//     const col = activeCol;
//     const pair = colStates[col].pairIndex;
//     const isTimedOut = colStates[col].timedOut;
//     const isReviewMode = reviewedCols.has(col); // Cek apakah sedang review
    
//     // Aturan penjumlahan: ambil digit terakhir dari hasil penjumlahan
//     // Contoh: 7 + 6 = 13, jawaban benar adalah 3 (digit terakhir)
//     // Contoh: 2 + 3 = 5, jawaban benar adalah 5
//     const sum = grid[pair][col] + grid[pair + 1][col];
//     const correctAnswer = sum % 10; // Ambil digit terakhir
    
//     const isCorrect = digit === correctAnswer;

//     // JIKA SEDANG REVIEW: Simpan di auditLog, TIDAK di answers
//     if (isReviewMode) {
//       setAuditLog((prev) => [
//         ...prev,
//         {
//           timestamp: new Date().toISOString(),
//           event: "answer_in_reviewed_column",
//           fromCol: col,
//           toCol: col,
//           pairsAnsweredInFromCol: answers[col].filter((a) => a !== null).length,
//           remainingTimeMs: colStates[col].timeLeftMs,
//           reviewAnswer: {
//             pairIndex: pair,
//             digit: digit,
//             isCorrect: isCorrect,
//           },
//         },
//       ]);
      
//       setFeedback(isCorrect ? "correct" : "wrong");
//       advancePair();
//       return;
//     }

//     // JIKA TIDAK REVIEW: Simpan jawaban: 1 untuk benar, 0 untuk salah
//     setAnswers((prev) => {
//       const n = prev.map((c) => [...c]);
//       n[col][pair] = isCorrect ? 1 : 0;
//       return n;
//     });

//     // Audit: kalau mengisi jawaban di kolom yang sudah timed-out
//     if (isTimedOut) {
//       setAuditLog((prev) => [
//         ...prev,
//         {
//           timestamp: new Date().toISOString(),
//           event: "answer_after_timeout",
//           fromCol: col,
//           toCol: col,
//           pairsAnsweredInFromCol: answers[col].filter((a) => a !== null).length + 1,
//           remainingTimeMs: 0,
//         },
//       ]);
//     }

//     setFeedback(isCorrect ? "correct" : "wrong");
//     advancePair();
//   }, [status, activeCol, colStates, grid, advancePair, answers, reviewedCols]);

//   /* ═══ NAVIGASI KEMBALI ═══ */
//   const goBack = useCallback(() => {
//     if (activeCol <= 0) return;

//     const fromCol = activeCol;
//     const toCol = activeCol - 1;
//     const answered = answers[fromCol].filter((a) => a !== null).length;

//     // Tandai kolom tujuan sebagai reviewed
//     setReviewedCols((prev) => new Set(prev).add(toCol));

//     // Audit: pencatatan navigasi kembali
//     setAuditLog((prev) => [
//       ...prev,
//       {
//         timestamp: new Date().toISOString(),
//         event: "back_navigate",
//         fromCol,
//         toCol,
//         pairsAnsweredInFromCol: answered,
//         remainingTimeMs: colStates[fromCol].timeLeftMs,
//       },
//     ]);

//     // Reset flag saat navigasi manual
//     isAdvancingRef.current = false;
//     setActiveCol(toCol);
//   }, [activeCol, answers, colStates]);

//   /* ═══ NAVIGASI MAJU ═══ */
//   const goForward = useCallback(() => {
//     if (activeCol >= COLS - 1) return;
    
//     const fromCol = activeCol;
//     const toCol = activeCol + 1;
//     const answered = answers[fromCol].filter((a) => a !== null).length;
    
//     // Cek apakah kolom tujuan sudah pernah dikerjakan (ada jawaban atau sudah timeout)
//     const targetHasAnswers = answers[toCol].some((a) => a !== null);
//     const targetIsTimedOut = colStates[toCol].timedOut;
    
//     if (targetHasAnswers || targetIsTimedOut) {
//       // Tandai kolom tujuan sebagai reviewed
//       setReviewedCols((prev) => new Set(prev).add(toCol));
//     }
    
//     // Audit: pencatatan navigasi maju
//     setAuditLog((prev) => [
//       ...prev,
//       {
//         timestamp: new Date().toISOString(),
//         event: "forward_navigate",
//         fromCol,
//         toCol,
//         pairsAnsweredInFromCol: answered,
//         remainingTimeMs: colStates[fromCol].timeLeftMs,
//       },
//     ]);
    
//     // Reset flag saat navigasi manual
//     isAdvancingRef.current = false;
//     setActiveCol((c) => c + 1);
//   }, [activeCol, answers, colStates]);

//   /* ═══ KEYBOARD LISTENER ═══
//      - Angka 0–9 (top row + numpad) → handleInput
//      - ArrowLeft  → goBack
//      - ArrowRight → goForward
//   */
//   useEffect(() => {
//     if (status !== "playing") return;

//     const onKey = (e: KeyboardEvent) => {
//       // Angka: key "0"–"9" (works for both top-row and numpad keys)
//       if (e.key >= "0" && e.key <= "9") {
//         e.preventDefault();
//         handleInput(Number(e.key));
//         return;
//       }
//       // Navigasi kolom
//       if (e.key === "ArrowLeft") {
//         e.preventDefault();
//         goBack();
//       }
//       if (e.key === "ArrowRight") {
//         e.preventDefault();
//         goForward();
//       }
//     };

//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [status, handleInput, goBack, goForward]);

//   /* ═══ START / RESET ═══ */
//   const startTest = () => {
//     setGrid(genGrid());
//     setAnswers(Array.from({ length: COLS }, () => Array(PAIRS).fill(null)));
//     setColStates(initColStates());
//     setActiveCol(0);
//     setFeedback(null);
//     setAuditLog([]);
//     setReviewedCols(new Set()); // Reset reviewed columns
//     isAdvancingRef.current = false; // Reset flag
//     setStatus("playing");
//   };

//   /* ═══════════════════════════════════════════════════════════
//      RENDER
//      ═══════════════════════════════════════════════════════════ */
  
//   // Jangan render grid sampai client-side hydration selesai
//   if (!isClient || grid.length === 0) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-stone-100">
//         <div className="text-stone-400 text-sm">Memuat tes...</div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="w-screen h-screen flex flex-col bg-stone-100 select-none overflow-hidden">

//       {/* ── TOP BAR ── */}
//       <div className="h-11 shrink-0 flex items-center justify-center border-b border-stone-200 bg-white">
//         <h1 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
//           Tes Kraepelin
//         </h1>
//       </div>

//       {/* ── MAIN AREA ── */}
//       <div className="flex-1 flex overflow-hidden min-h-0">

//         {/* ─── GRID AREA ─── */}
//         <div className="flex-1 overflow-auto p-3">
//           <div className="flex gap-0 w-max">
//             {/* Render tiap kolom */}
//             {grid[0].map((_, cIdx) => {
//               const isActiveCol = cIdx === activeCol;
//               const colHasAnswers = answers[cIdx].some((a) => a !== null);
//               const colIsComplete = colStates[cIdx].timedOut && cIdx !== activeCol;

//               return (
//                 <div
//                   key={cIdx}
//                   className={[
//                     "flex flex-col",
//                     isActiveCol
//                       ? "bg-blue-100 rounded-sm"
//                       : colIsComplete || colHasAnswers
//                         ? "bg-emerald-50"
//                         : "",
//                   ].join(" ")}
//                 >
//                   {grid.map((rowArr, rIdx) => {
//                     const isTopActive =
//                       isActiveCol && status === "playing" && rIdx === currentPair;
//                     const isBotActive =
//                       isActiveCol && status === "playing" && rIdx === currentPair + 1;
//                     const isHighlighted = isTopActive || isBotActive;
//                     const isLastRow = rIdx === ROWS - 1;

//                     return (
//                       <div
//                         key={rIdx}
//                         ref={
//                           isTopActive 
//                             ? activeCellRef 
//                             : (isLastRow && cIdx === 0 ? bottomRef : null)
//                         }
//                         className={[
//                           "w-7 h-5 flex items-center justify-center text-xs border-b border-stone-100 transition-colors duration-100",
//                           isHighlighted
//                             ? "bg-blue-600 text-white font-bold border-b-blue-700"
//                             : "text-stone-500 font-medium",
//                         ].join(" ")}
//                       >
//                         {rowArr[cIdx]}
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ─── RIGHT PANEL ─── */}
//         <div className="w-48 shrink-0 border-l border-stone-200 bg-white flex flex-col items-center justify-center gap-5 px-4">

//           {/* ── IDLE: Start ── */}
//           {status === "idle" && (
//             <div className="flex flex-col items-center gap-4 w-full">
//               <p className="text-stone-400 text-xs text-center leading-relaxed">
//                 Tekan <span className="font-semibold text-stone-500">Mulai</span> untuk
//                 memulai tes.<br />
//                 Gunakan angka <span className="font-semibold text-stone-500">0–9</span> di
//                 keyboard atau tombol di bawah.<br />
//                 <span className="font-semibold text-stone-500">← →</span> untuk navigasi kolom.
//               </p>
//               <button
//                 onClick={startTest}
//                 className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-lg shadow transition-colors duration-150"
//               >
//                 Mulai Tes
//               </button>
//             </div>
//           )}

//           {/* ── PLAYING: Numpad + Nav ── */}
//           {status === "playing" && (
//             <>
//               {/* Feedback */}
//               <div className="h-6 flex items-center justify-center">
//                 {feedback && (
//                   <span
//                     className={[
//                       "text-xs font-semibold px-3 py-0.5 rounded-full",
//                       feedback === "correct"
//                         ? "bg-emerald-100 text-emerald-700"
//                         : "bg-red-100 text-red-700",
//                     ].join(" ")}
//                   >
//                     {feedback === "correct" ? "✓ Benar" : "✕ Salah"}
//                   </span>
//                 )}
//               </div>

//               {/* Numpad */}
//               <div className="grid grid-cols-3 gap-1.5 w-full">
//                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
//                   <button
//                     key={n}
//                     onClick={() => handleInput(n)}
//                     className="bg-white border border-stone-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-95 text-stone-700 font-bold text-lg rounded-lg shadow-sm transition-all duration-100 flex items-center justify-center"
//                     style={{ height: "3.25rem" }}
//                   >
//                     {n}
//                   </button>
//                 ))}
//               </div>

//               {/* Prev / Next */}
//               <div className="flex gap-2 w-full">
//                 <button
//                   onClick={goBack}
//                   disabled={activeCol <= 0}
//                   className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors duration-100
//                              disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed
//                              enabled:bg-stone-100 enabled:text-stone-600 enabled:border-stone-200 enabled:hover:bg-stone-200"
//                 >
//                   ← Prev
//                 </button>
//                 <button
//                   onClick={goForward}
//                   disabled={activeCol >= COLS - 1}
//                   className="flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors duration-100
//                              disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed
//                              enabled:bg-blue-600 enabled:text-white enabled:border-blue-600 enabled:hover:bg-blue-700"
//                 >
//                   Next →
//                 </button>
//               </div>
//             </>
//           )}

//           {/* ── FINISHED: Auto redirect, no UI ── */}
//           {status === "finished" && (
//             <div className="flex flex-col items-center gap-4 w-full">
//               <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 w-full text-center">
//                 <p className="text-sm text-stone-500">Mengirim hasil tes...</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

