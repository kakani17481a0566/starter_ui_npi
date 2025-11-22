import { useState, useEffect } from "react";
import { QUICK_CHECKLIST_SLIDES } from "./data";

// ⬅️ Accept onFinish from parent
export default function QuickChecklistCard({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

  // 🧩 Keyboard navigation (Right Arrow / Enter / Space)
  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowRight", "Enter", " "].includes(e.key)) handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const SLIDE_COUNT = QUICK_CHECKLIST_SLIDES.length;

  const handleNext = () => {
    // ⭐ LAST SLIDE → trigger finish callback
    if (activeIndex === SLIDE_COUNT) {
      if (onFinish) onFinish();
      return;
    }

    // Otherwise go to next slide
    setActiveIndex((prev) => (prev === SLIDE_COUNT ? 1 : prev + 1));
    setCheckedItems([]);
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const goTo = (i) => {
    setActiveIndex(i);
    setCheckedItems([]);
  };

  const current = QUICK_CHECKLIST_SLIDES[activeIndex - 1];
  const fallbackImage =
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80";

  // ----------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: "#91AF9B" }}
    >
      <div
        style={{
          display: "flex",
          width: "880px",
          height: "500px",
          borderRadius: "14px",
          overflow: "hidden",
          backgroundColor: "#F6F8F5",
          boxShadow: "0px 6px 14px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* LEFT PANEL */}
        <div style={{ width: "58%", backgroundColor: "#F4F7F1", position: "relative" }}>
          {/* Header */}
          <div
            style={{
              backgroundColor: "#618B60",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 18,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Quick Checklist
          </div>

          {/* Content */}
          <div
            style={{
              padding: "28px 36px 80px 36px",
              position: "relative",
              height: "calc(100% - 52px)",
            }}
          >
            {/* Title Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <h2 style={{ color: "#20492F", fontWeight: 700, fontSize: 22, margin: 0 }}>
                Nutrition
              </h2>
              <span style={{ color: "#37443E", fontSize: 13 }}>Saturday, 18 October</span>
            </div>

            {/* Slide Title */}
            <p
              style={{
                color: "#253D2F",
                fontWeight: 600,
                fontSize: 14,
                margin: "0 0 18px 0",
              }}
            >
              {current.title}
            </p>

            {/* Points List */}
            <ul style={{ listStyleType: "none", padding: 0, margin: 0, fontSize: 13 }}>
              {current.points.map((item, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "flex-start",
                    lineHeight: 1.5,
                  }}
                >
                  {current.showCheckbox && (
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(i)}
                      onChange={() => handleCheckboxChange(i)}
                      style={{ marginRight: 8, marginTop: 3 }}
                    />
                  )}
                  <div>
                    <span style={{ color: "#345CA8", fontWeight: 600 }}>
                      {item.heading}
                    </span>
                    {item.text && (
                      <p
                        style={{
                          margin: "6px 0 0 4px",
                          color: "#2E3832",
                          fontSize: 13,
                        }}
                      >
                        {item.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Controls */}
            <div
              style={{
                position: "absolute",
                bottom: 26,
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              {/* Navigation Dots */}
              <div style={{ display: "flex", gap: 10 }}>
                {QUICK_CHECKLIST_SLIDES.map((slide, i) => (
                  <div
                    key={slide.id}
                    onClick={() => goTo(i + 1)}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: activeIndex === i + 1 ? "#365D41" : "#B9C9BA",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: "#A2B6A3",
                  color: "#1C3326",
                  width: 140,
                  height: 42,
                  border: "none",
                  borderRadius: 5,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
                }}
              >
                {activeIndex === SLIDE_COUNT ? "Get started" : "Next"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div style={{ width: "42%", position: "relative" }}>
          <img
            src={current.image}
            alt="Nutrition section image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}
