// // hooks/useAntiCheat.ts
// "use client";

// import { useEffect, useCallback } from "react";

// type ViolationType = "PrintScreen" | "Snipping Tool";

// interface UseAntiCheatWithLogOptions {
//   mode: "log";
//   onViolation: (type: ViolationType, timestamp: Date) => void;
// }

// interface UseAntiCheatSilentOptions {
//   mode: "silent";
// }

// type UseAntiCheatOptions = UseAntiCheatWithLogOptions | UseAntiCheatSilentOptions;

// export function useAntiCheat(options: UseAntiCheatOptions) {
//   const clearClipboard = useCallback(async (attempt: number) => {
//     try {
//       await navigator.clipboard.writeText("");
//       console.log(`🧹 Clipboard dikosongkan — percobaan ke-${attempt}`);
//     } catch (err) {
//       console.error(`❌ Gagal mengosongkan clipboard ke-${attempt}:`, err);
//     }
//   }, []);

//   const handleViolation = useCallback(
//     async (type: ViolationType) => {
//       console.log(`🚨 ${type} terdeteksi!`);

//       await clearClipboard(1);
//       setTimeout(() => clearClipboard(2), 100);
//       setTimeout(() => clearClipboard(3), 200);

//       if (options.mode === "log") {
//         options.onViolation(type, new Date());
//       }
//     },
//     [clearClipboard, options]
//   );

//   useEffect(() => {
//     // Deteksi PrintScreen via keyboard
//     const handleKeyDown = async (e: KeyboardEvent) => {
//       console.log(`⌨️ Tombol ditekan: ${e.key}`);

//       if (e.key === "PrintScreen") {
//         await handleViolation("PrintScreen");
//       }
//     };

//     // Deteksi Win+Shift+S via focus event
//     const handleFocus = async () => {
//       // Tunggu sampai document benar-benar focused
//       await new Promise((resolve) => setTimeout(resolve, 100));

//       try {
//         await navigator.clipboard.readText();
//         console.log("🔍 Clipboard berisi text — dikosongkan.");
//         await clearClipboard(1);
//       } catch {
//         console.log("🚨 Clipboard berisi non-text (kemungkinan screenshot) — dikosongkan!");
//         await handleViolation("Snipping Tool");
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("focus", handleFocus);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, [handleViolation, clearClipboard]);
// }

// hooks/useAntiCheat.ts
"use client";

import { useEffect, useCallback } from "react";

type ViolationType = "PrintScreen" | "Snipping Tool";

interface UseAntiCheatWithLogOptions {
  mode: "log";
  onViolation: (type: ViolationType, timestamp: Date) => void;
}

interface UseAntiCheatSilentOptions {
  mode: "silent";
}

type UseAntiCheatOptions = UseAntiCheatWithLogOptions | UseAntiCheatSilentOptions;

export function useAntiCheat(options: UseAntiCheatOptions) {
  const clearClipboard = useCallback(async (attempt: number) => {
    if (!document.hasFocus()) {
      // console.log(`⏳ Document belum focused, skip percobaan ke-${attempt}`);
      return;
    }
    try {
      await navigator.clipboard.writeText("");
      // console.log(`🧹 Clipboard dikosongkan — percobaan ke-${attempt}`);
    } catch (err) {
      // console.error(`❌ Gagal mengosongkan clipboard ke-${attempt}:`, err);
    }
  }, []);

  const handleViolation = useCallback(
    async (type: ViolationType) => {
      // console.log(`🚨 ${type} terdeteksi!`);

      await clearClipboard(1);
      setTimeout(() => clearClipboard(2), 300);
      setTimeout(() => clearClipboard(3), 600);
      setTimeout(() => clearClipboard(4), 1000); // ← percobaan ekstra

      if (options.mode === "log") {
        options.onViolation(type, new Date());
      }
    },
    [clearClipboard, options]
  );

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // console.log(`⌨️ Tombol ditekan: ${e.key}`);

      if (e.key === "PrintScreen") {
        await handleViolation("PrintScreen");
      }
    };

    const handleFocus = async () => {
      // Poll sampai document benar-benar focused, maksimal 10 kali (1 detik)
      let attempts = 0;
      const maxAttempts = 10;

      const waitForFocus = async () => {
        if (document.hasFocus()) {
          try {
            await navigator.clipboard.readText();
            // console.log("🔍 Clipboard berisi text — dikosongkan.");
            await clearClipboard(1);
          } catch {
            // console.log("🚨 Clipboard berisi non-text (kemungkinan screenshot) — dikosongkan!");
            await handleViolation("Snipping Tool");
          }
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(waitForFocus, 100); // cek lagi 100ms kemudian
        } else {
          // console.log("⚠️ Document tidak focused setelah 1 detik, dibatalkan.");
        }
      };

      await waitForFocus();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus", handleFocus);
    };
  }, [handleViolation, clearClipboard]);
}