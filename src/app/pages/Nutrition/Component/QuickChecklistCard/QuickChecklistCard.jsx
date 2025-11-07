import { useEffect, useState } from "react";

export default function QuickChecklistCard() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

  // Remove default body margin so the background fills edge-to-edge
  useEffect(() => {
    const prev = document.body.style.margin;
    document.body.style.margin = "0";
    return () => { document.body.style.margin = prev; };
  }, []);

  // Keyboard: →/Enter/Space = Next
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const SLIDE_COUNT = 3;

  const handleNext = () => {
    setActiveIndex((p) => (p === SLIDE_COUNT ? 1 : p + 1));
    setCheckedItems([]);
  };

  const goTo = (i) => {
    setActiveIndex(i);
    setCheckedItems([]);
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80";

  const slides = [
    {
      title: "Yesterday’s summary",
      showCheckbox: false,
      points: [
        {
          heading: "Highlights of previous day",
          text:
            "Analyse previous day calorie count including updates from first entry card.",
        },
        { heading: "Performance review of last day", text: "Review based on last day activity." },
        {
          heading: "Neuropi schedule",
          text: "Show how many days the user has used this platform after subscription.",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Today’s reminder",
      showCheckbox: true,
      points: [
        { heading: "Foods to avoid", text: "List the food items to be avoided by the user according to the report." },
        { heading: "Meal reminder", text: "Follow the advised time intervals between the food or meals. Eg: 2 hours between each meal." },
        { heading: "Things not to skip for today", text: "Mention any important step as a reminder here." },
      ],
      image:
        "https://images.unsplash.com/photo-1606851093502-75e39f89c676?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "NeuroPi pro-tip",
      showCheckbox: false,
      points: [
        {
          heading:
            "An expert piece of advice, often short and actionable, used to improve results or solve a problem quickly.",
          text: "",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1572441710534-680b3a1a58c9?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  const current = slides[activeIndex - 1];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#91AF9B",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 880,
          height: 500,
          borderRadius: 14,
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
              padding: "28px 36px 40px 36px",
              position: "relative",
              height: "calc(100% - 52px)",
            }}
          >
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

            <p style={{ color: "#253D2F", fontWeight: 600, fontSize: 14, margin: "0 0 18px 0" }}>
              {current.title}
            </p>

            <ul style={{ listStyleType: "none", padding: 0, margin: 0, fontSize: 13 }}>
              {current.points.map((item, i) => (
                <li key={i} style={{ marginBottom: 18, display: "flex", alignItems: "flex-start" }}>
                  {current.showCheckbox && (
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(i)}
                      onChange={() => handleCheckboxChange(i)}
                      style={{ marginRight: 8, marginTop: 3 }}
                    />
                  )}
                  <div>
                    <span style={{ color: "#345CA8", fontWeight: 600 }}>{item.heading}</span>
                    {item.text && (
                      <p
                        style={{
                          margin: `${current.showCheckbox ? 6 : 6}px 0 0 ${current.showCheckbox ? 4 : 14}px`,
                          color: "#2E3832",
                        }}
                      >
                        {item.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* ALWAYS-VISIBLE CONTROLS (overlay), aligned to LEFT panel */}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 0,
            width: "58%",            // matches left panel width
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            zIndex: 10,              // guaranteed on top
            pointerEvents: "auto",
          }}
        >
          {/* Dots */}
          <div style={{ display: "flex", gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                title={`Go to slide ${i}`}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: activeIndex === i ? "#365D41" : "#B9C9BA",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Next */}
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
  );
}
