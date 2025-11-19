import { useState, useRef, useEffect } from "react";
import IngredientListSVG from "./IngredientList.jsx";
import InstructionBoard from "./InstructionBoard.jsx";
import BlenderSVG from "./BlenderSVG.jsx";

// ---------------------------------------------------------
// Ingredient List
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// Ingredient Shelf Item — Supports Touch + Mouse + Pen
// ---------------------------------------------------------
const IngredientShelfItem = ({ name, image, onPointerDown }) => (
  <div
    className="
      mx-[1%] flex
      cursor-grab items-center justify-center
      overflow-hidden rounded-lg border bg-white shadow-md
      hover:scale-105 touch-none
      h-[80%] w-[12%]
      sm:w-[16%]
      xs:w-[22%]
    "
    onPointerDown={(e) => onPointerDown(e, name)}
  >
    <img
      src={image}
      alt={name}
      className="h-full w-full object-contain p-2 pointer-events-none"
    />
  </div>
);

// ---------------------------------------------------------
// MAIN GAME COMPONENT
// ---------------------------------------------------------
export default function Blunder() {
  const [blenderContents, setBlenderContents] = useState([]);
  const [message, setMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);

  const dragItemRef = useRef(null);
  const pointerOffset = useRef({ x: 0, y: 0 });

  // ---------------------------------------------------------
  // PREVENT TOUCH SCROLL DURING DRAGGING
  // ---------------------------------------------------------
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, []);

  // ---------------------------------------------------------
  // RESPONSIVE SCALING
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // SAFE POINTER POSITION (Fix for mobile where clientX=0)
  // ---------------------------------------------------------
  const getPointerPos = (e) => ({
    x: e.clientX || e.touches?.[0]?.clientX || 0,
    y: e.clientY || e.touches?.[0]?.clientY || 0,
  });

  // ---------------------------------------------------------
  // START DRAG
  // ---------------------------------------------------------
  const handlePointerDown = (e, name) => {
    e.preventDefault();

    const img = e.currentTarget.cloneNode(true);
    img.style.position = "fixed";
    img.style.width = "120px";
    img.style.height = "120px";
    img.style.zIndex = "99999";
    img.style.pointerEvents = "none";

    document.body.appendChild(img);
    dragItemRef.current = { element: img, name };

    pointerOffset.current = {
      x: img.offsetWidth / 2,
      y: img.offsetHeight / 2,
    };

    moveDragImage(e);
    window.addEventListener("pointermove", moveDragImage);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // ---------------------------------------------------------
  // MOVE DRAG SHADOW
  // ---------------------------------------------------------
  const moveDragImage = (e) => {
    const drag = dragItemRef.current?.element;
    if (!drag) return;

    const pos = getPointerPos(e);
    drag.style.left = `${pos.x - pointerOffset.current.x}px`;
    drag.style.top = `${pos.y - pointerOffset.current.y}px`;
  };

  // ---------------------------------------------------------
  // DROP HANDLING
  // ---------------------------------------------------------
  const handlePointerUp = (e) => {
    const drag = dragItemRef.current;
    if (!drag) return;

    const dropZone = document.getElementById("blender-drop-zone");
    const rect = dropZone.getBoundingClientRect();
    const pos = getPointerPos(e);

    const inside =
      pos.x >= rect.left &&
      pos.x <= rect.right &&
      pos.y >= rect.top &&
      pos.y <= rect.bottom;

    if (inside) handleDrop(drag.name);

    drag.element.remove();
    dragItemRef.current = null;

    window.removeEventListener("pointermove", moveDragImage);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  // ---------------------------------------------------------
  // GAME DROP LOGIC
  // ---------------------------------------------------------
  const handleDrop = (name) => {
    const item = ingredientsData.find((i) => i.name === name);

    if (!item) return;
    if (blenderContents.includes(name))
      return setMessage(`${name} already added.`);
    if (!item.required)
      return setMessage(`${name} is NOT required!`);

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

  // ---------------------------------------------------------
  // RESET
  // ---------------------------------------------------------
  const handleReset = () => {
    setBlenderContents([]);
    setMessage("");
    setIsComplete(false);
  };

  const fillLevel = Math.min(80, (blenderContents.length / totalRequired) * 80);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="relative flex h-screen w-full justify-center items-center overflow-hidden">
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
        {/* BLENDER DROP ZONE */}
        <div
          id="blender-drop-zone"
          className="absolute flex flex-col items-center"
          style={{
            top: window.innerWidth < 768 ? "12%" : "22%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <BlenderSVG fillLevel={fillLevel} />

          {isComplete && (
            <p className="mt-3 text-[#4f0c00] font-extrabold text-[1.2vw] animate-pulse">
              READY!
            </p>
          )}
        </div>

        {/* INSTRUCTIONS */}
        <div
          className="absolute"
          style={{ left: "5%", top: "10%", width: "480px", height: "500px" }}
        >
          <InstructionBoard
            text={
              "Read the ingredients from the list given next to the image.\nDrag and drop the ingredients into the blender to make an energetic smoothie."
            }
          />
        </div>

        {/* INGREDIENT LIST */}
        <div
          className="absolute"
          style={{ right: "5%", top: "10%", width: "480px", height: "500px" }}
        >
          <IngredientListSVG
            requiredIngredients={requiredIngredients}
            blenderContents={blenderContents}
          />
        </div>

        {/* SHELF ITEMS */}
        <div
          className="absolute flex justify-around items-center"
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
              onPointerDown={handlePointerDown}
            />
          ))}
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          className="absolute right-[3%] bottom-[4%] px-4 py-2 text-white bg-red-600 font-bold rounded-xl hover:bg-red-700"
        >
          Reset Game
        </button>

        {/* MESSAGE */}
        {message && (
          <div
            className="absolute p-4 rounded-lg font-semibold shadow-lg text-center"
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
