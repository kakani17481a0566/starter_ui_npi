// src/components/security/SecurityGuard.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { getSessionData } from "../../utils/sessionStorage"; // adjust path if needed

const DEBUG = true;
const log = (...a) => DEBUG && console.log("[SecurityGuard]", ...a);

export default function SecurityGuard({
  title = "Secure Mode",
  watermark,                 // if provided, it overrides session user
  deferUntilArmed = false,
  children,
}) {
  const handle = useFullScreenHandle();
  const [locked, setLocked] = useState(false);
  const [wmText, setWmText] = useState("");
  const [armed, setArmed] = useState(false);
  const unlockTimer = useRef(null);

  // Watermark: prefer prop; else session user; else "Confidential"
  useEffect(() => {
    const { user } = getSessionData();
    const who = (typeof watermark === "string" && watermark.length > 0) ? watermark : (user || "Confidential");
    const text = `${who} • ${new Date().toLocaleString()}`;
    setWmText(text);
    log("Watermark resolved to:", who);
    return () => log("Unmounting SecurityGuard");
  }, [watermark]);

  // Guards (only after armed)
  useEffect(() => {
    if (!armed) { log("Guards NOT armed yet."); return; }
    log("Arming guards.");
    const onVis = () => { log("visibilitychange hidden?", document.hidden); if (document.hidden) setLocked(true); };
    const onBlur = () => { log("window blur → lock"); setLocked(true); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    return () => {
      log("Disarming guards.");
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
    };
  }, [armed]);

  // Blockers
  useEffect(() => {
    const preventContext = (e) => { e.preventDefault(); };
    const blockKeys = (e) => {
      const k = (e.key || "").toLowerCase();
      const ctrlMeta = e.ctrlKey || e.metaKey;
      const combo =
        (ctrlMeta && ["s","p","u","c","x","v","a"].includes(k)) ||
        (e.ctrlKey && e.shiftKey && ["i","j"].includes(k)) ||
        k === "f12";
      if (combo) { e.preventDefault(); e.stopPropagation(); }
    };
    document.addEventListener("contextmenu", preventContext);
    window.addEventListener("keydown", blockKeys, true);
    return () => {
      document.removeEventListener("contextmenu", preventContext);
      window.removeEventListener("keydown", blockKeys, true);
    };
  }, []);

  useEffect(() => () => { if (unlockTimer.current) clearTimeout(unlockTimer.current); }, []);

  async function enterFullscreen() {
    log("enterFullscreen() called.");
    try {
      await handle.enter();
      log("Fullscreen entered?", !!document.fullscreenElement);
      setArmed(true);
      setLocked(false);
    } catch (err) {
      log("Fullscreen FAILED:", err);
      // If you must strictly require fullscreen, do not arm here:
      // setArmed(true);
    }
  }

  const shouldRenderChildren = armed || !deferUntilArmed;

  return (
    <FullScreen
      handle={handle}
      onChange={(isFull) => {
        log("FullScreen onChange:", { isFull });
        if (isFull) {
          setArmed(true);
          setLocked(false);
        } else {
          setArmed(false);
          setLocked(true);
        }
      }}
    >
      {/* Header */}
      <div style={styles.toolbar}>
        <div style={styles.titleWrap}>
          <div aria-hidden style={styles.badge}>SECURE</div>
          <h2 style={styles.title}>{title}</h2>
        </div>
        <div>
          <button type="button" style={styles.btnPrimary} onClick={enterFullscreen}>Go Fullscreen</button>
        </div>
      </div>

      {/* Watermark overlays */}
      <div aria-hidden style={styles.watermarkLines} />
      <div aria-hidden style={styles.watermarkText}><div>{wmText}</div></div>

      {/* Content (gated) */}
      <div style={locked ? styles.contentLocked : styles.content}>
        {shouldRenderChildren ? children : (
          <div style={styles.placeholder}>
            <div>Click <b>Go Fullscreen</b> to continue…</div>
          </div>
        )}
      </div>

      {/* Lock overlay */}
      {locked && (
        <div style={styles.lockOverlay}>
          <div style={styles.lockCard}>
            <div style={styles.lockHeader}>
              <span aria-hidden style={styles.lockDot} />
              <span style={styles.lockStatus}>Session Paused</span>
            </div>
            <p style={styles.lockText}>We detected a tab/app switch or window focus loss. Re-enter fullscreen to continue.</p>
            <div style={styles.lockActions}>
              <button type="button" style={styles.btnGhost} onClick={() => window.location.reload()}>Reload</button>
              <button type="button" style={styles.btnPrimary} onClick={enterFullscreen}>Re-enter Fullscreen</button>
            </div>
          </div>
        </div>
      )}
    </FullScreen>
  );
}

const styles = {
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, margin: "0 0 14px 0" },
  titleWrap: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  badge: { fontSize: 11, letterSpacing: ".12em", fontWeight: 800, padding: "6px 8px", borderRadius: 999, color: "#0b7a3d", background: "#e6fbf0", border: "1px solid #bdf0d5" },
  title: { margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: ".02em", color: "#1f2937" },

  btnPrimary: { appearance: "none", border: "1px solid transparent", borderRadius: 12, padding: "8px 12px", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "#111827", color: "#fff" },
  btnGhost: { appearance: "none", border: "1px solid #d1d5db", borderRadius: 12, padding: "8px 12px", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "#fff", color: "#111827" },

  content: { position: "relative", minHeight: 80 },
  contentLocked: { position: "relative", pointerEvents: "none", userSelect: "none", filter: "blur(6px)", minHeight: 80 },
  placeholder: { display: "grid", placeItems: "center", height: 120, border: "1px dashed #d1d5db", borderRadius: 12, background: "#fafafa", color: "#6b7280", fontSize: 14 },

  watermarkLines: { position: "fixed", inset: 0, zIndex: 40, pointerEvents: "none", opacity: 0.12, background: "repeating-linear-gradient(45deg, rgba(0,0,0,.55) 0 2px, transparent 2px 80px)", mixBlendMode: "multiply" },
  watermarkText: { position: "fixed", inset: 0, zIndex: 41, pointerEvents: "none", display: "grid", placeItems: "center", textAlign: "center", opacity: 0.2, fontSize: 18, fontWeight: 700, padding: "0 16px" },

  lockOverlay: { position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,.72)", display: "grid", placeItems: "center" },
  lockCard: { width: "100%", maxWidth: 520, background: "#fff", color: "#111827", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.25)", padding: 22 },
  lockHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  lockDot: { width: 10, height: 10, background: "#ef4444", borderRadius: "50%", display: "inline-block" },
  lockStatus: { fontWeight: 800, letterSpacing: ".02em" },
  lockText: { margin: "8px 0 16px", fontSize: 14, color: "#4b5563" },
  lockActions: { display: "flex", justifyContent: "flex-end", gap: 8 },
};
