import { useState, useRef, useEffect } from "react";
import IngredientListSVG from "./IngredientList.jsx";
import InstructionBoard from "./InstructionBoard.jsx";
import BlenderSVG from "./BlenderSVG.jsx";

const ingredientsData = [
  { name: "Beetroot", image: "https://images.unsplash.com/vector-1763542801962-915d223dbefa?q=80&w=744", required: true },
  { name: "Ginger", image: "https://images.unsplash.com/vector-1763542801792-e25e50f23a61?q=80&w=938", required: true },
  { name: "Carrot", image: "https://images.unsplash.com/vector-1763542801825-daaedc6e8e52?q=80&w=1168", required: true },
  { name: "Lime", image: "https://images.unsplash.com/vector-1763542801758-703b0009204c?q=80&w=880", required: true },
  { name: "Banana", image: "https://images.unsplash.com/vector-1763542801852-4362fd4a15b6?q=80&w=799", required: true },
  { name: "Milk", image: "https://images.unsplash.com/vector-1763542801759-52a37cabbf2a?q=80&w=716", required: false },
];

const requiredIngredients = ["Beetroot", "Ginger", "Carrot", "Lime", "Banana"];
const totalRequired = requiredIngredients.length;

// ✅ FIX 1: PREVENT IMAGE FROM HIJACKING DRAG
const IngredientShelfItem = ({ name, image, onDragStart }) => (
  <div
    className="mx-[1%] flex h-[80%] w-[12%] cursor-grab active:cursor-grabbing items-center justify-center overflow-hidden rounded-lg border bg-white shadow-md hover:scale-105 transition-transform"
    draggable={true}
    onDragStart={(e) => {
      e.dataTransfer.effectAllowed = "move";
      onDragStart(e, name);
    }}
  >
    {/* Added pointer-events-none and draggable=false to the image */}
    <img 
      src={image} 
      alt={name} 
      draggable={false}
      className="h-full w-full object-contain p-2 pointer-events-none select-none" 
    />
  </div>
);

export default function Blunder() {
  const [blenderContents, setBlenderContents] = useState([]);
  const [message, setMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);

  /* ---------------------------------------------------------
        RESPONSIVE SCALING
  --------------------------------------------------------- */
  useEffect(() => {
    const container = containerRef.current;

    const resizeGame = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      const scale = Math.min(scaleX, scaleY);

      container.style.transform = `scale(${scale})`;
      container.style.left = `${(window.innerWidth - 1920 * scale) / 2}px`;
      container.style.top = `${(window.innerHeight - 1080 * scale) / 2}px`;
    };

    resizeGame();
    window.addEventListener("resize", resizeGame);
    return () => window.removeEventListener("resize", resizeGame);
  }, []);

  /* ---------------------------------------------------------
        DRAG START
  --------------------------------------------------------- */
  const handleDragStart = (e, name) => {
    e.dataTransfer.setData("ingredientName", name);
  };

  /* ---------------------------------------------------------
        DROP INTO BLENDER
  --------------------------------------------------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    const name = e.dataTransfer.getData("ingredientName");
    
    // Guard clause if something invalid was dropped
    if (!name) return;

    const item = ingredientsData.find((i) => i.name === name);

    if (!item) return;
    if (blenderContents.includes(name)) return setMessage(`${name} already added.`);
    if (!item.required) return setMessage(`${name} is NOT required!`);

    setBlenderContents((prev) => {
      const updated = [...prev, name];

      if (updated.length === totalRequired) {
        setIsComplete(true);
        setMessage("SUCCESS! Energetic Smoothie Ready!");
      } else {
        setMessage(`Added ${name}! ${totalRequired - updated.length} more to go.`);
      }

      return updated;
    });
  };

  const handleDragOver = (e) => {
    // ✅ FIX 2: Explicitly allow drop and set visual feedback
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /* ---------------------------------------------------------
        RESET GAME
  --------------------------------------------------------- */
  const handleReset = () => {
    setBlenderContents([]);
    setMessage("");
    setIsComplete(false);
  };

  const fillLevel = Math.min(80, (blenderContents.length / totalRequired) * 80);

  /* ---------------------------------------------------------
        MAIN RENDER
  --------------------------------------------------------- */
  return (
    <div className="relative flex h-screen w-full justify-center items-center overflow-hidden bg-gray-900">
      <div
        ref={containerRef}
        className="relative bg-cover bg-center shadow-2xl"
        style={{
          width: "1920px",
          height: "1080px",
          backgroundImage:
            "url('https://images.unsplash.com/vector-1763543660982-4e5781323c10?q=80&w=1332')",
          transformOrigin: "top left",
        }}
      >

        {/* ---------------------------------------------------------
               BLENDER (DROP ZONE)
        --------------------------------------------------------- */}
        <div
          className="absolute flex flex-col items-center z-50" // Added z-50 to ensure it's on top
          style={{ 
            top: "22%", 
            left: "50%", 
            transform: "translateX(-50%)",
            minWidth: "300px", // Ensure hit area exists
            minHeight: "400px" 
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <BlenderSVG fillLevel={fillLevel} />

          {isComplete && (
            <p className="mt-3 text-[#4f0c00] font-extrabold text-[1.2vw] animate-pulse bg-white/80 px-4 py-1 rounded-full">
              READY!
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------
               INSTRUCTION BOARD (LEFT SIDE)
        --------------------------------------------------------- */}
        <div
          className="absolute"
          style={{
            left: "5%",
            top: "10%",
            width: "480px",
            height: "500px",
          }}
        >
          <InstructionBoard
            text={
              "Read the ingredients from the list given next to the image.\nDrag and drop the ingredients into the blender to make an energetic smoothie."
            }
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          />
        </div>

        {/* ---------------------------------------------------------
               INGREDIENT LIST (RIGHT SIDE)
        --------------------------------------------------------- */}
        <div
          className="absolute"
          style={{ right: "5%", top: "10%", width: "480px", height: "500px" }}
        >
          <IngredientListSVG
            requiredIngredients={requiredIngredients}
            blenderContents={blenderContents}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          />
        </div>

        {/* ---------------------------------------------------------
               SHELF ITEMS
        --------------------------------------------------------- */}
        <div
          className="absolute flex justify-around items-center z-40"
          style={{
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: "20%",
          }}
        >
          {ingredientsData.map((item) => (
            <IngredientShelfItem
              key={item.name}
              name={item.name}
              image={item.image}
              onDragStart={handleDragStart}
            />
          ))}
        </div>

        {/* ---------------------------------------------------------
               RESET BUTTON
        --------------------------------------------------------- */}
        <button
          onClick={handleReset}
          className="absolute right-[3%] bottom-[4%] px-4 py-2 text-white bg-red-600 font-bold rounded-xl hover:bg-red-700 z-50"
        >
          Reset Game
        </button>

        {/* ---------------------------------------------------------
               MESSAGE POPUP
        --------------------------------------------------------- */}
        {message && (
          <div
            className="absolute p-4 rounded-lg font-semibold shadow-lg text-center z-50"
            style={{
              top: "55%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "20vw",
              backgroundColor: isComplete ? "#d4edda" : "#fff3cd",
              color: isComplete ? "#155724" : "#856404",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}