import  { useState } from "react";
import slidesData from "./slidesData.json"; // External JSON file for slide data
export default function QuickChecklistCard() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const handleNext = () => {
    setActiveIndex((prev) => (prev === slidesData.length ? 1 : prev + 1));
    setCheckedItems([]);
  };
  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
  const current = slidesData[activeIndex - 1];
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#91AF9B" }}>
      <div
        style={{
          display: "flex",
          width: "880px",
          height: "500px",
          borderRadius: "14px",
          overflow: "hidden",
          backgroundColor: "#F6F8F5",
          boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.25)",
          position: "relative",
        }}
      >
        {/* Left Section */}
        <div style={{ width: "58%", backgroundColor: "#F4F7F1", position: "relative" }}>
          {/* Header */}
          <div
            style={{
              backgroundColor: "#618B60",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "18px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Quick Checklist
          </div>
          {/* Content */}
          <div style={{ padding: "28px 36px 80px 36px", position: "relative", height: "calc(100% - 52px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h2 style={{ color: "#20492F", fontWeight: 700, fontSize: "22px" }}>Nutrition</h2>
              <span style={{ color: "#37443E", fontSize: "13px" }}>Saturday, 18 October</span>
            </div>
            <p style={{ color: "#253D2F", fontWeight: 600, fontSize: "14px", marginBottom: "18px" }}>{current.title}</p>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0, fontSize: "13px" }}>
              {current.points.map((item, index) => (
                <li key={index} style={{ marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                  {current.showCheckbox && (
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                      style={{ marginRight: "8px", marginTop: "3px" }}
                    />
                  )}
                  <div>
                    <span style={{ color: "#345CA8", fontWeight: 600 }}>{item.heading}</span>
                    {item.text && (
                      <p style={{ marginLeft: current.showCheckbox ? "4px" : "14px", marginTop: "6px", color: "#2E3832" }}>
                        {item.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {/* Bottom Section */}
            <div
              style={{
                position: "absolute",
                bottom: "26px",
                left: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              {/* Dots */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {slidesData.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: activeIndex === i + 1 ? "#365D41" : "#B9C9BA",
                      transition: "all 0.3s ease",
                    }}
                  ></div>
                ))}
              </div>
              {/* Next Button */}
              <button
                onClick={handleNext}
                style={{
                  backgroundColor: "#A2B6A3",
                  color: "#1C3326",
                  width: "140px",
                  height: "42px",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {activeIndex === slidesData.length ? "Get started" : "Next"}
              </button>
            </div>
          </div>
        </div>
        {/* Right Image Section */}
        <div style={{ width: "42%", position: "relative" }}>
          <img
            src={current.image}
            alt="Nutrition section image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}