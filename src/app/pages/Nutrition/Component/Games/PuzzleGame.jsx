import { useState, useEffect } from "react";
import turtleImage from "./crocodile.webp";

/* ==========================================================
   ⚙️ CONFIGURATION
   ========================================================== */
const GRID = 3;
const PIECE = 100;
const SPACING = 5;
const TOTAL = GRID * GRID;
const BOARD = GRID * PIECE;

/* ==========================================================
   🔊 Native Audio (No Libraries)
   ========================================================== */
const playBeep = (freq = 440, duration = 0.15) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
  const trayPositions = Array.from({ length: TOTAL }, (_, i) => ({
    x: (i % GRID) * spacing + 20 + Math.random() * 30,
    y: Math.floor(i / GRID) * (spacing + 10) + 20 + Math.random() * 10,
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
      trayX: trayPositions[i].x,
      trayY: trayPositions[i].y,
      bg: `-${c * PIECE}px -${r * PIECE}px`,
      placed: false,
      snapping: false,
    };
  });
};

/* ==========================================================
   🎮 MAIN COMPONENT
   ========================================================== */
export default function PuzzleGame() {
  const [pieces, setPieces] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setPieces(createPieces(turtleImage));
  }, []);

  useEffect(() => {
    if (pieces.length === 0) return;
    const allCorrect = pieces.every(
      (p) => p.placed && p.gridX === p.correctX && p.gridY === p.correctY
    );
    if (allCorrect && !solved) {
      setSolved(true);
      playWin();
    } else {
      setSolved(allCorrect);
    }
  }, [pieces]);

  const reset = () => {
    setPieces(createPieces(turtleImage));
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

    if (piece.correctX === x && piece.correctY === y) {
      playCorrect();
      setPieces((prev) =>
        prev.map((p) =>
          p.id === dragging
            ? { ...p, snapping: true, gridX: x, gridY: y, placed: true }
            : p
        )
      );
      setTimeout(() => {
        setPieces((prev) =>
          prev.map((p) =>
            p.id === dragging ? { ...p, snapping: false } : p
          )
        );
      }, 250);
    } else {
      playWrong();
      // Smooth revert animation
      setPieces((prev) =>
        prev.map((p) =>
          p.id === dragging
            ? { ...p, snapping: true, gridX: null, gridY: null, placed: false }
            : p
        )
      );
      setTimeout(() => {
        setPieces((prev) =>
          prev.map((p) =>
            p.id === dragging ? { ...p, snapping: false } : p
          )
        );
      }, 300);
    }
    setDragging(null);
  };

  const getPos = (p) =>
    p.placed
      ? { left: p.gridX * PIECE, top: p.gridY * PIECE }
      : { left: p.trayX, top: p.trayY };

  /* ==========================================================
     🎨 UI
     ========================================================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex flex-col items-center py-10 select-none overflow-hidden">
      <h1 className="text-4xl font-bold mb-6 text-emerald-800">
        🧩 Turtle Puzzle
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
        >
          {/* Faint reference image underneath */}
          <img
            src={turtleImage}
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
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(c, r)}
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
                className={`absolute rounded-md border border-gray-300 cursor-grab bg-cover transition-all duration-300
                            ${p.snapping ? "scale-105 shadow-lg" : "active:scale-95"}`}
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
              src={turtleImage}
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
      >
        <div className="relative min-h-[180px] flex justify-center flex-wrap gap-4">
          {pieces
            .filter((p) => !p.placed)
            .map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragEnd={onDragEnd}
                className={`absolute bg-cover rounded-md cursor-grab border border-gray-300
                            shadow-md hover:shadow-lg transition-all duration-300 ${
                              p.snapping ? "scale-105" : "active:scale-95"
                            }`}
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
