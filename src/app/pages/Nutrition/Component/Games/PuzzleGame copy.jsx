import { useState, useEffect } from "react";
import puzzleImage from "./crocodile.webp";

/* ==========================================================
   ⚙️ CONFIGURATION
   ========================================================== */
const GRID = 3;
const PIECE = 100;
const SPACING = 5;
const TOTAL = GRID * GRID;
const BOARD = GRID * PIECE;

/* ==========================================================
   🔊 Native Audio (Fixed Robustness)
   ========================================================== */
const playBeep = (freq = 440, duration = 0.15) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.value = 0.08;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
};
const playCorrect = () => playBeep(880, 0.2);
const playWrong = () => playBeep(220, 0.25);
const playWin = () => {
  const seq = [660, 880, 1040, 1320];
  seq.forEach((f, i) => setTimeout(() => playBeep(f, 0.15), i * 150));
};

/* ==========================================================
   🧩 Generate Puzzle Pieces
   ========================================================== */
const createPieces = (img) => {
  const spacing = PIECE + SPACING;

  // 1. Create unique tray positions (horizontal line)
  const uniqueTrayPositions = Array.from({ length: TOTAL }, (_, i) => ({
    x: i * spacing + 20,
    y: 20,
  })).sort(() => Math.random() - 0.5);

  return Array.from({ length: TOTAL }, (_, i) => {
    const r = Math.floor(i / GRID);
    const c = i % GRID;
    return {
      id: `piece-${i}`,
      img,
      correctX: c,
      correctY: r,
      gridX: null,
      gridY: null,
      trayX: uniqueTrayPositions[i].x,
      trayY: uniqueTrayPositions[i].y,
      bg: `-${c * PIECE}px -${r * PIECE}px`,
      placed: false,
    };
  });
};

// --- Helper to calculate pixel position for rendering ---
const getPos = (p) =>
  p.placed
    ? { left: p.gridX * PIECE, top: p.gridY * PIECE }
    : { left: p.trayX, top: p.trayY };

/* ==========================================================
   🎮 MAIN COMPONENT
   ========================================================== */
export default function PuzzleGame() {
  const [pieces, setPieces] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setPieces(createPieces(puzzleImage));
  }, []);

  useEffect(() => {
    if (pieces.length === 0) return;
    const allCorrect = pieces.every(
      (p) => p.placed && p.gridX === p.correctX && p.gridY === p.correctY
    );
    if (allCorrect && !solved) {
      setSolved(true);
      playWin();
    } else if (solved && !allCorrect) {
      setSolved(false);
    }
  }, [pieces, solved]);

  const reset = () => {
    setPieces(createPieces(puzzleImage));
    setSolved(false);
  };

  /* ---------------------------------------------
     🧠 Drag & Drop Logic
     --------------------------------------------- */
  const onDragStart = (id) => setDragging(id);
  const onDragEnd = () => setDragging(null);

  const onDrop = (x, y) => {
    if (!dragging) return;
    const piece = pieces.find((p) => p.id === dragging);
    if (!piece) return;

    // Check if the current drop target (x, y) is already occupied (and not dropping on the same piece)
    const isTargetOccupied = pieces.some(p => p.placed && p.gridX === x && p.gridY === y && p.id !== piece.id);
    if (isTargetOccupied) {
      playWrong();
      setDragging(null);
      return;
    }

    // Check if drop is outside a valid target area (x=-1, y=-1 is signal for drop outside any target)
    if (x === -1) {
      playWrong();
      // Reset to tray
      setPieces((prev) =>
        prev.map((p) =>
          p.id === dragging ? { ...p, gridX: null, gridY: null, placed: false } : p
        )
      );
      setDragging(null);
      return;
    }


    if (piece.correctX === x && piece.correctY === y) {
      playCorrect();
      setPieces((prev) =>
        prev.map((p) =>
          p.id === dragging
            ? { ...p, gridX: x, gridY: y, placed: true } // Snap to correct grid position
            : p
        )
      );
    } else {
      playWrong();
      // CRITICAL FIX: Reset placement status and grid position instantly.
      setPieces((prev) =>
        prev.map((p) =>
          p.id === dragging
            ? { ...p, gridX: null, gridY: null, placed: false }
            : p
        )
      );
    }
    setDragging(null);
  };

  /* ==========================================================
     🎨 UI
     ========================================================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex flex-col items-center py-10 select-none">
      <h1 className="text-4xl font-bold mb-6 text-emerald-800">
        🧩 Drag-and-Drop Puzzle
      </h1>

      {solved && (
        <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center animate-pulse">
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            🎉 Perfect! You Won! 🎉
          </h2>
          <button
            onClick={reset}
            className="mt-2 px-5 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Game Board */}
      <div className="flex flex-wrap items-start justify-center gap-10 mt-10">
        {/* Board */}
        <div
          className="relative bg-white rounded-lg shadow-lg border-2 border-emerald-600 overflow-hidden"
          style={{ width: BOARD, height: BOARD }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(-1, -1)} // Trap drops outside targets
        >
          {/* Faint reference image underneath (Ghost Image) */}
          <img
            src={puzzleImage}
            alt="reference faint"
            className="absolute inset-0 opacity-20 pointer-events-none select-none"
            draggable="false"
            style={{ width: BOARD, height: BOARD, objectFit: "cover" }}
          />

          {/* Target grid */}
          {Array.from({ length: GRID }).map((_, r) =>
            Array.from({ length: GRID }).map((_, c) => (
              <div
                key={`target-${r}-${c}`}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.stopPropagation(); onDrop(c, r); }}
                className="absolute border border-dashed border-emerald-200 rounded-md hover:bg-emerald-50 transition"
                style={{
                  left: c * PIECE,
                  top: r * PIECE,
                  width: PIECE,
                  height: PIECE,
                }}
              ></div>
            ))
          )}

          {/* Placed pieces */}
          {pieces
            .filter((p) => p.placed)
            .map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragEnd={onDragEnd}
                className={`absolute rounded-md border border-gray-300 cursor-grab bg-cover transition-all duration-300 active:scale-95`}
                style={{
                  backgroundImage: `url(${p.img})`,
                  backgroundPosition: p.bg,
                  backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                  width: PIECE,
                  height: PIECE,
                  ...getPos(p),
                }}
              ></div>
            ))}
        </div>

        {/* Reference (full) */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-emerald-700 mb-3">
            Reference
          </h3>
          <div className="relative">
            <img
              src={puzzleImage}
              alt="Reference"
              className="w-40 h-40 rounded-lg shadow-lg object-cover border border-emerald-300"
            />
          </div>
        </div>
      </div>

      {/* Tray Section */}
      <div
        className="relative w-full flex justify-center mt-10 bg-white shadow-inner border-t border-emerald-200 py-6 overflow-x-auto"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <h3 className="absolute top-0 left-1/2 -translate-x-1/2 text-lg font-semibold text-gray-600 pt-2">
          Drag pieces from here:
        </h3>
        {/* Inner container for absolute positioning */}
        <div className="relative" style={{ minWidth: `${TOTAL * (PIECE + SPACING) + 40}px`, height: '150px' }}>
          {pieces
            .filter((p) => !p.placed)
            .map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragEnd={onDragEnd}
                className={`absolute rounded-md border border-gray-300 cursor-grab bg-cover transition-all duration-300 active:scale-95`}
                style={{
                  backgroundImage: `url(${p.img})`,
                  backgroundPosition: p.bg,
                  backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                  width: PIECE,
                  height: PIECE,
                  ...getPos(p),
                }}
              ></div>
            ))}
        </div>
      </div>

      {!solved && (
        <button
          onClick={reset}
          className="mt-8 px-6 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-600 transition"
        >
          Reset Board
        </button>
      )}
    </div>
  );
}