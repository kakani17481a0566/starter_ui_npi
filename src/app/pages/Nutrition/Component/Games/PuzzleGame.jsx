import { useState, useEffect } from "react";
import puzzleImage from "./crocodile.webp";

/* ==========================================================
   ⚙️ CONFIGURATION
   ========================================================== */
const GRID = 3;
const PIECE = 100; // Size in pixels
const TOTAL = GRID * GRID;
const BOARD = GRID * PIECE;

/* ==========================================================
   🔊 Native Audio
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
   🧩 Data Logic
   ========================================================== */
// Robust Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const createPieces = (img) => {
  // 1. Generate the pieces in order first
  const pieces = Array.from({ length: TOTAL }, (_, i) => {
    const r = Math.floor(i / GRID);
    const c = i % GRID;
    return {
      id: `piece-${i}`,
      img,
      correctX: c,
      correctY: r,
      gridX: null, // Only used when placed on board
      gridY: null, // Only used when placed on board
      bg: `-${c * PIECE}px -${r * PIECE}px`,
      placed: false,
    };
  });

  // 2. Shuffle them so they appear randomly in the tray
  return shuffleArray(pieces);
};

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
    }
  }, [pieces, solved]);

  const reset = () => {
    setPieces(createPieces(puzzleImage));
    setSolved(false);
  };

  const onDragStart = (id) => setDragging(id);
  const onDragEnd = () => setDragging(null);

  const onDrop = (targetX, targetY) => {
    if (!dragging) return;
    
    // Find the piece being dragged
    const currentPiece = pieces.find(p => p.id === dragging);
    if (!currentPiece) return;

    // 1. If dropped outside (targetX = -1), reset to tray
    if (targetX === -1) {
      playWrong();
      setPieces(prev => prev.map(p => 
        p.id === dragging ? { ...p, placed: false, gridX: null, gridY: null } : p
      ));
      setDragging(null);
      return;
    }

    // 2. Check if the target spot is already taken by ANOTHER piece
    const isOccupied = pieces.some(p => p.placed && p.gridX === targetX && p.gridY === targetY && p.id !== dragging);
    
    if (isOccupied) {
      playWrong();
      // Return to tray if spot is taken
      setPieces(prev => prev.map(p => 
        p.id === dragging ? { ...p, placed: false, gridX: null, gridY: null } : p
      ));
      setDragging(null);
      return;
    }

    // 3. Check if it's the CORRECT spot
    if (currentPiece.correctX === targetX && currentPiece.correctY === targetY) {
      playCorrect();
      setPieces(prev => prev.map(p => 
        p.id === dragging ? { ...p, placed: true, gridX: targetX, gridY: targetY } : p
      ));
    } else {
      playWrong();
      // Incorrect spot -> Send back to tray
      setPieces(prev => prev.map(p => 
        p.id === dragging ? { ...p, placed: false, gridX: null, gridY: null } : p
      ));
    }
    setDragging(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex flex-col items-center py-10 select-none">
      <h1 className="text-4xl font-bold mb-6 text-emerald-800">
        🧩 Drag-and-Drop Puzzle
      </h1>

      {solved && (
        <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center animate-pulse mb-6">
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

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 w-full max-w-5xl px-4">
        
        {/* --- PUZZLE BOARD --- */}
        <div
          className="relative bg-white rounded-lg shadow-lg border-2 border-emerald-600 overflow-hidden shrink-0"
          style={{ width: BOARD, height: BOARD }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(-1, -1)} // Catch drops that miss a target
        >
          {/* Ghost Image */}
          <img
            src={puzzleImage}
            alt="ghost"
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Grid Targets */}
          {Array.from({ length: GRID }).map((_, r) =>
            Array.from({ length: GRID }).map((_, c) => (
              <div
                key={`target-${r}-${c}`}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.stopPropagation(); onDrop(c, r); }}
                className="absolute border border-dashed border-emerald-200 z-0"
                style={{
                  left: c * PIECE,
                  top: r * PIECE,
                  width: PIECE,
                  height: PIECE,
                }}
              />
            ))
          )}

          {/* PLACED PIECES (Absolute Positioning) */}
          {pieces.filter(p => p.placed).map((p) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => onDragStart(p.id)}
              onDragEnd={onDragEnd}
              className="absolute border border-gray-300 cursor-grab shadow-md z-10"
              style={{
                backgroundImage: `url(${p.img})`,
                backgroundPosition: p.bg,
                backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                width: PIECE,
                height: PIECE,
                left: p.gridX * PIECE,
                top: p.gridY * PIECE,
              }}
            />
          ))}
        </div>

        {/* --- REFERENCE IMAGE (Hidden on mobile) --- */}
        <div className="hidden md:flex flex-col items-center">
          <h3 className="text-lg font-semibold text-emerald-700 mb-3">Reference</h3>
          <img
            src={puzzleImage}
            alt="Reference"
            className="w-40 h-40 rounded-lg shadow-lg object-cover border border-emerald-300"
          />
        </div>
      </div>

      {/* --- TRAY SECTION (Flexbox Layout - No Absolute) --- */}
      <div 
        className="w-full max-w-3xl mt-10 px-4"
        onDragOver={(e) => e.preventDefault()} 
        onDrop={() => onDrop(-1, -1)} // Catch drops into tray
      >
        <div className="bg-white shadow-inner border-t border-emerald-200 rounded-xl p-4 min-h-[160px] flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Drag pieces from here:</h3>
          
          {/* HORIZONTAL SCROLL CONTAINER 
             We use standard flexbox here. No absolute positioning.
             This guarantees perfect spacing and mobile scrolling.
          */}
          <div className="flex gap-3 overflow-x-auto w-full pb-4 px-2 justify-start md:justify-center">
            {pieces.filter(p => !p.placed).map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragEnd={onDragEnd}
                className="shrink-0 rounded-md border border-gray-300 cursor-grab shadow-md hover:shadow-lg hover:scale-105 transition-transform"
                style={{
                  backgroundImage: `url(${p.img})`,
                  backgroundPosition: p.bg,
                  backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                  width: PIECE,
                  height: PIECE,
                }}
              />
            ))}
            
            {/* Spacer if tray is empty to keep height */}
            {pieces.every(p => p.placed) && (
              <div className="text-gray-400 italic h-[100px] flex items-center">
                All pieces placed!
              </div>
            )}
          </div>
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