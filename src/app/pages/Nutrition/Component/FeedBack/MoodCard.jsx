import { useState } from "react";
import { toast } from "sonner";
import { saveMood } from "./data";

export default function MoodCard({
  placeholder = "Tell us how you’re feeling today...",
  themeColor = "#5d8b63",
  buttonColor = "#89a894",
  textColor = "#1e2c22",
  image = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
  onDone,
}) {
  const [text, setText] = useState("");

  const onSave = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Please share your thoughts.");
      return;
    }

    toast.promise(saveMood(text), {
      loading: "Saving your response...",
      success: (res) => {
        setText("");
        if (typeof onDone === "function") onDone();
        return res.message || "Saved successfully!";
      },
      error: "Something went wrong!",
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/nutration/Bg_for_feedback_cards.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "880px",
          height: "500px",
          borderRadius: "14px",
          overflow: "hidden",
          backgroundColor: "#F6F8F5",
        }}
      >
        {/* LEFT PANEL */}
        <div style={{ width: "58%" }}>
          {/* Header — USING PLACEHOLDER */}
          <div
            style={{
              backgroundColor: themeColor,
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 18,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {placeholder}
          </div>

          {/* Form */}
          <form
            onSubmit={onSave}
            style={{
              padding: "28px 36px",
              height: "calc(100% - 52px)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Removed the duplicate heading here */}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              style={{
                width: "100%",
                height: "200px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d0d7cd",
                resize: "none",
                fontSize: 14,
                color: "#2E3832",
                fontWeight: 500,
                background: "rgba(255,255,255,0.6)",
                outline: "none",
              }}
            />

            {/* Save Button */}
            <button
              type="submit"
              style={{
                backgroundColor: buttonColor,
                color: textColor,
                width: 140,
                height: 42,
                border: "none",
                borderRadius: 5,
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                marginTop: "auto",
                alignSelf: "center",
                boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
              }}
            >
              Save
            </button>
          </form>
        </div>

        {/* RIGHT IMAGE PANEL */}
        <div style={{ width: "42%" }}>
          <img
            src={image}
            alt="Mood background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    </div>
  );
}
