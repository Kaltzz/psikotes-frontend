import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation"; // ganti ke "next/router" jika Pages Router

export function useBackGuard(
  message = "Apakah Anda yakin ingin meninggalkan halaman ini?",
  enabled = true
) {
  const router = useRouter();
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);
  const isHandlingRef = useRef(false);

  // ── Inject modal ke DOM ───────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("back-guard-overlay")) return;

    const style = document.createElement("style");
    style.id = "back-guard-style";
    style.textContent = `
      #back-guard-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.45);
        align-items: center;
        justify-content: center;
      }
      #back-guard-box {
        background: #f0f0f0;
        border: 1px solid #aaa;
        border-radius: 6px;
        width: 420px;
        max-width: 92vw;
        box-shadow: 0 4px 24px rgba(0,0,0,0.25);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        overflow: hidden;
      }
      #back-guard-titlebar {
        background: #e1e1e1;
        border-bottom: 1px solid #aaa;
        padding: 8px 14px;
        font-size: 13px;
        font-weight: 600;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #back-guard-titlebar span { font-size: 16px; }
      #back-guard-body {
        padding: 20px 20px 16px;
        font-size: 14px;
        color: #222;
        line-height: 1.55;
      }
      #back-guard-footer {
        padding: 8px 16px 14px;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
      #back-guard-footer button {
        padding: 5px 20px;
        font-size: 13px;
        border-radius: 4px;
        cursor: pointer;
        min-width: 72px;
      }
      #back-guard-btn-cancel {
        background: #f0f0f0;
        border: 1px solid #aaa;
        color: #222;
      }
      #back-guard-btn-cancel:hover { background: #e0e0e0; }
      #back-guard-btn-ok {
        background: #0078d4;
        border: 1px solid #005fa3;
        color: #fff;
        font-weight: 600;
      }
      #back-guard-btn-ok:hover { background: #005fa3; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "back-guard-overlay";
    overlay.innerHTML = `
      <div id="back-guard-box">
        <div id="back-guard-titlebar">
          <span>⚠️</span> Konfirmasi
        </div>
        <div id="back-guard-body">
          <p id="back-guard-message" style="margin:0"></p>
        </div>
        <div id="back-guard-footer">
          <button id="back-guard-btn-cancel">Batal</button>
          <button id="back-guard-btn-ok">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("back-guard-btn-ok")!
      .addEventListener("click", () => resolveRef.current?.(true));
    document.getElementById("back-guard-btn-cancel")!
      .addEventListener("click", () => resolveRef.current?.(false));

    return () => {
      overlay.remove();
      document.getElementById("back-guard-style")?.remove();
    };
  }, []);

  // ── Tampilkan modal ───────────────────────────────────────────────────────
  const showAlert = useCallback((msg: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const overlay = document.getElementById("back-guard-overlay");
      const msgEl = document.getElementById("back-guard-message");
      if (!overlay || !msgEl) return resolve(false);

      msgEl.textContent = msg;
      overlay.style.display = "flex";

      resolveRef.current = (confirmed: boolean) => {
        overlay.style.display = "none";
        resolveRef.current = null;
        resolve(confirmed);
      };
    });
  }, []);

  // ── Pasang popstate listener ──────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    // ✅ FIX CHROME + Next.js router.push:
    // Delay 100ms agar Next.js selesai commit navigasi ke browser history
    // sebelum kita dorong state dummy.
    const timer = setTimeout(() => {
      window.history.pushState(null, "", window.location.href);
      window.history.pushState(null, "", window.location.href);
    }, 100);

    const handlePopState = () => {
      if (isHandlingRef.current) return;
      isHandlingRef.current = true;

      setTimeout(() => {
        window.history.pushState(null, "", window.location.href);

        showAlert(message).then((confirmed) => {
          isHandlingRef.current = false;

          if (confirmed) {
            sessionStorage.removeItem("testSession");
            localStorage.removeItem("isPassed");
            localStorage.removeItem("tempAnswers");
            router.push("/");
          }
        });
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled, message, showAlert, router]);
}