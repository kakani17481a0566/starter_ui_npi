import  { useRef, useState, useEffect, useLayoutEffect } from "react";

/**
 * FollowTheLineGame — Kid-friendly variant (Tailwind)
 * - Colorful gradient background
 * - Bouncy character animation while idle/dragging
 * - Animated dotted path with glow
 * - Confetti + sparkles on success
 * - Big rounded Play Again button
 */

export default function FollowTheLineGame() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const dragRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  // Initial position is calculated in resetDraggableToStart, using a starting value here
  const [pos, setPos] = useState({ x: 150, y: 40 });
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState(""); // "" | "fail" | "success"
  const [confettiKey, setConfettiKey] = useState(0); // to re-trigger confetti

  // --- CHARACTER DIMENSION CONSTANTS ---
  // Using w-20, which is 5rem or 80px, a standard Tailwind size.
  const DRAG_SIZE = 80;
  const DRAG_HALF_SIZE = DRAG_SIZE / 2; // 40

  const PATH_HALF_WIDTH = 36;
  const FAIL_RESET_DELAY = 900;

  useLayoutEffect(() => {
    resetDraggableToStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // small utility: client -> local
  function clientToLocal(clientX, clientY) {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function moveToClient(clientX, clientY) {
    if (!containerRef.current) return;
    const local = clientToLocal(clientX, clientY);
    const cont = containerRef.current.getBoundingClientRect();

    // Use the defined size constants for calculation
    const dragW = DRAG_SIZE,
      dragH = DRAG_SIZE;

    // Keep the center of the drag element within the container bounds
    const clampedX = Math.max(dragW / 2, Math.min(local.x, cont.width - dragW / 2));
    const clampedY = Math.max(dragH / 2, Math.min(local.y, cont.height - dragH / 2));
    setPos({ x: clampedX, y: clampedY });
    checkOnPath(clampedX, clampedY);
  }

  // Input handling: pointer preferred, fallbacks included
  useEffect(() => {
    const dragEl = dragRef.current;
    if (!dragEl) return;

    function handlePointerDown(e) {
      if (locked) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      setDragging(true);
      try {
        dragEl.setPointerCapture(e.pointerId);
      } catch (err) {
        console.error("Pointer capture failed:", err);
      }
    }
    function handlePointerMove(e) {
      if (!dragging) return;
      e.preventDefault();
      moveToClient(e.clientX, e.clientY);
    }
    function handlePointerUp(e) {
      setDragging(false);
      try {
        dragEl.releasePointerCapture && dragEl.releasePointerCapture(e.pointerId);
      } catch (err) {
        console.error("Pointer release failed:", err);
      }
    }

    // mouse fallback (simplified for brevity, main logic is pointer)
    function handleMouseDown(e) {
      if (locked || window.PointerEvent) return; // Skip if PointerEvent supported
      if (e.button !== 0) return;
      e.preventDefault();
      setDragging(true);
    }
    function handleMouseMove(e) {
      if (!dragging || window.PointerEvent) return;
      e.preventDefault();
      moveToClient(e.clientX, e.clientY);
    }
    function handleMouseUp() {
      if (window.PointerEvent) return;
      setDragging(false);
    }

    // touch fallback (simplified for brevity, main logic is pointer)
    function handleTouchStart(e) {
      if (locked || window.PointerEvent) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      e.preventDefault();
      setDragging(true);
    }
    function handleTouchMove(e) {
      if (!dragging || window.PointerEvent) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      e.preventDefault();
      moveToClient(t.clientX, t.clientY);
    }
    function handleTouchEnd() {
      if (window.PointerEvent) return;
      setDragging(false);
    }

    if (window.PointerEvent) {
      dragEl.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointermove", handlePointerMove, { passive: false });
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    } else {
      dragEl.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);

      dragEl.addEventListener("touchstart", handleTouchStart, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("touchcancel", handleTouchEnd);
    }

    return () => {
      // Cleanup all listeners properly
      if (window.PointerEvent) {
        dragEl.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      } else {
        dragEl.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        dragEl.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("touchcancel", handleTouchEnd);
      }
    };
  }, [dragging, locked]);

  function checkOnPath(x, y) {
    if (!pathRef.current || locked) return;
    const pathRect = pathRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate path center relative to container
    const centerX = pathRect.left + pathRect.width / 2 - containerRect.left;
    const bottomY = pathRect.bottom - containerRect.top;

    // Check if X position is within the path width
    const dx = Math.abs(x - centerX);

    if (dx > PATH_HALF_WIDTH) {
      triggerFail();
      return;
    }

    // Check if the character reached the goal
    // Goal is 80px high (bottom-8: 32px height of goal, plus 8px margin from bottom)
    const goalLineY = bottomY - 20; // Check a bit above the goal sticker
    if (y >= goalLineY) {
      triggerSuccess();
    }
  }

  function triggerFail() {
    // Only trigger fail if currently dragging
    if (!dragging) return;
    setLocked(true);
    setMessage("fail");
    setDragging(false);
    setTimeout(() => {
      resetDraggableToStart();
    }, FAIL_RESET_DELAY);
  }

  function triggerSuccess() {
    setLocked(true);
    setMessage("success");
    setDragging(false);
    // trigger confetti/sparkles
    setConfettiKey((k) => k + 1);
  }

  function resetDraggableToStart() {
    if (!containerRef.current || !pathRef.current) return;
    const cont = containerRef.current.getBoundingClientRect();
    const path = pathRef.current.getBoundingClientRect();

    // Calculate start X: center of the path
    const startX = path.left + path.width / 2 - cont.left;
    // Calculate start Y: above the path start, offset by half the character size
    const startY = Math.max(DRAG_HALF_SIZE, path.top - cont.top - DRAG_HALF_SIZE);

    setPos({ x: startX, y: startY });
    setMessage("");
    setLocked(false);
  }

  // Confetti generation helper (returns array of pieces)
  function makeConfetti(num = 24) {
    return new Array(num).fill(0).map((_, i) => {
      const left = Math.round(10 + Math.random() * 80); // percent
      const rotate = Math.round(Math.random() * 360);
      const delay = (Math.random() * 0.6).toFixed(2);
      const size = 6 + Math.round(Math.random() * 10);
      const colors = ["#ff6b6b", "#ffd166", "#6bf178", "#6bd0ff", "#b38bff"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { id: `${confettiKey}-${i}`, left, rotate, delay, size, color };
    });
  }

  // Sparkle generation helper (returns array of pieces)
  function makeSparkles(num = 8) {
      return new Array(num).fill(0).map((_, i) => ({
          id: `${confettiKey}-s-${i}`,
          top: `${10 + Math.random() * 80}%`,
          left: `${10 + Math.random() * 80}%`,
          delay: (Math.random() * 0.5).toFixed(2),
          duration: (1 + Math.random() * 0.5).toFixed(2),
          size: 4 + Math.round(Math.random() * 6),
      }));
  }

  // tiny inline CSS for animations (confetti, sparkle, bounce, path-glow)
  const inlineStyles = `
    @keyframes confetti-drop {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(60vh) rotate(540deg); opacity: 0; }
    }
    @keyframes float {
      0%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } 100%{ transform: translateY(0) }
    }
    @keyframes sparkle {
      0%{ transform: scale(0.6); opacity:0.1 } 50%{ transform: scale(1.1); opacity:1 } 100%{ transform: scale(0.8); opacity:0 }
    }
    @keyframes pulse-glow {
      0% { opacity: 0.7; filter: blur(5px) brightness(1.0); }
      50% { opacity: 0.9; filter: blur(6px) brightness(1.15); }
      100% { opacity: 0.7; filter: blur(5px) brightness(1.0); }
    }
  `;

  const isIdleAndLive = !dragging && !locked;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100" style={{ fontFamily: "Poppins, Inter, system-ui, sans-serif" }}>
      {/* inject tiny CSS for animations */}
      <style>{inlineStyles}</style>

      <div
        ref={containerRef}
        className="relative w-[360px] sm:w-[460px] md:w-[560px] h-[700px] sm:h-[760px] bg-gradient-to-br from-rose-100 via-yellow-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/60"
        style={{ touchAction: "none" }}
      >
        {/* Top cloud/header */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-2xl shadow-md">🎈</div>
            <div className="text-xl font-extrabold text-slate-800 drop-shadow-sm">Follow the Line</div>
          </div>
          <button
            className="bg-white/90 px-3 py-1 rounded-full text-sm font-semibold shadow hover:scale-105 active:scale-95 transition"
            onClick={resetDraggableToStart}
            disabled={locked}
          >
            Restart
          </button>
        </div>

        {/* instructions - Adjusted for cleaner separation from header */}
        <div className="absolute top-16 left-6 right-6 text-center text-sm text-slate-700 z-10">
          <div className="bg-white/70 inline-block px-3 py-1 rounded-full shadow">Drag the happy face along the dotted path — don’t wobble off!</div>
        </div>

        {/* playful dotted path */}
        <div
          ref={pathRef}
          className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-3 rounded-full flex items-stretch justify-center"
          aria-hidden
        >
          {/* glowing inner line (now pulsating) */}
          <div
            className="absolute inset-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-pink-400 via-yellow-300 to-cyan-400 opacity-70 filter blur-sm"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          ></div>
          {/* dotted visible */}
          <div className="relative w-3 h-full flex flex-col justify-between py-6">
            {/* create repeated dots */}
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-white shadow-sm transform-gpu"
                style={{ boxShadow: "0 6px 12px rgba(0,0,0,0.08)" }}
              />
            ))}
          </div>
        </div>

        {/* goal (friend) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-16 text-center z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg transform-gpu animate-float" style={{ animation: "float 2.2s ease-in-out infinite" }}>
            <div className="text-3xl">🏁</div>
          </div>
          <div className="mt-2 text-sm text-slate-700 font-medium">Reach me!</div>
        </div>

        {/* draggable character - using w-20 h-20 (80px) and calculated centering */}
        <div
          ref={dragRef}
          // Using standard w-20 h-20 class
          className="absolute w-20 h-20 rounded-full touch-none select-none"
          style={{
            // Use DRAG_HALF_SIZE (40) for precise centering
            left: `${pos.x - DRAG_HALF_SIZE}px`,
            top: `${pos.y - DRAG_HALF_SIZE}px`,
            transform: dragging ? "scale(1.06)" : "scale(1)",
            transition: dragging ? "none" : "transform 200ms ease, left 200ms ease, top 200ms ease",
            zIndex: 50,
            cursor: locked ? "default" : "grab",
          }}
          aria-label="draggable character"
        >
          {/* outer glow circle (now bouncy when idle) */}
          <div
            className={`w-full h-full rounded-full flex items-center justify-center shadow-2xl ${
              dragging
                ? "bg-gradient-to-br from-rose-300 to-yellow-300"
                : "bg-gradient-to-br from-pink-400 to-cyan-300"
            }`}
            style={{
                boxShadow: "0 10px 30px rgba(99,102,241,0.12)",
                animation: isIdleAndLive ? "float 1.8s ease-in-out infinite" : "none", // Apply float when idle and live
            }}
          >
            {/* character face / sticker */}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl select-none" style={{ transform: dragging ? "translateY(-4px)" : "translateY(0)", transition: "transform 180ms" }}>
              😊
            </div>
          </div>
        </div>

        {/* Success overlay: confetti + sparkles + big card + Play Again */}
        {message === "success" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-auto z-50 backdrop-blur-sm">
            {/* confetti pieces */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {makeConfetti(24).map((c) => (
                <div
                  key={c.id}
                  style={{
                    position: "absolute",
                    left: `${c.left}%`,
                    top: "-10%",
                    width: c.size,
                    height: c.size * 0.6,
                    background: c.color,
                    transform: `rotate(${c.rotate}deg)`,
                    borderRadius: 2,
                    animation: `confetti-drop 1.4s ${c.delay}s cubic-bezier(.2,.7,.2,1) forwards`,
                    opacity: 0.98,
                  }}
                />
              ))}
            </div>

            <div className="relative">
                {/* Sparkles around the message card */}
                {makeSparkles(8).map((s) => (
                    <div
                        key={s.id}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: s.id.includes('0') || s.id.includes('4') ? '#ffda00' : '#ffffff',
                            top: s.top,
                            left: s.left,
                            width: s.size,
                            height: s.size,
                            animation: `sparkle ${s.duration}s ${s.delay}s ease-out infinite`,
                            boxShadow: '0 0 8px currentColor',
                            opacity: 0,
                        }}
                    />
                ))}

                <div className="bg-white/95 px-8 py-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 relative z-10 scale-100 animate-in fade-in zoom-in-50 duration-500">
                    <div className="text-4xl font-extrabold text-emerald-600">Well done! 🎉</div>
                    <div className="text-sm text-slate-700">You kept the friend on the line — great job!</div>
                    <button
                        className="mt-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transition-all"
                        onClick={resetDraggableToStart}
                    >
                        Play Again
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* Fail overlay: Try Again */}
        {message === "fail" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className="bg-white/90 px-6 py-3 rounded-2xl text-2xl font-bold text-rose-600 shadow animate-in slide-in-from-top-10 duration-500">Try Again!</div>
          </div>
        )}

        <div className="absolute bottom-3 left-0 right-0 text-center text-xs text-slate-600">
          Works on mobile & tablet — use your finger or mouse.
        </div>
      </div>
    </div>
  );
}