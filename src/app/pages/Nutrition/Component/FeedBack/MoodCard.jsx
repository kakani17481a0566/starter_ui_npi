import { useState } from "react";
import { toast } from "sonner";

export default function MoodCard({
  question,       // backend question text
  questionId,     // backend question id
  targetDate,     // backend provided date (yesterday)
  save,           // save({ questionId, text, date })
  themeColor = "#5d8b63",
  buttonColor = "#89a894",
  textColor = "#1e2c22",
  image = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  onDone,
}) {

  const [text, setText] = useState("");

  const onSave = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Please share your thoughts.");
      return;
    }

    toast.promise(
      save({
        questionId,
        text,
        date: targetDate, // 🔥 EXACT DATE FROM BACKEND
      }),
      {
        loading: "Saving your response...",
        success: (res) => {
          setText("");
          onDone?.();
          return res.message || "Saved successfully!";
        },
        error: "Something went wrong!",
      }
    );
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
          width: 880,
          height: 500,
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "#F6F8F5",
        }}
      >
        {/* LEFT PANEL */}
        <div style={{ width: "58%" }}>
          <div
            style={{
              backgroundColor: themeColor,
              color: "#FFF",
              fontWeight: 600,
              fontSize: 18,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {question}
          </div>

          {/* ▶️ SHOW DATE FOR DEBUGGING & UI CONFIRMATION */}
          <div style={{ paddingLeft: 36, paddingTop: 8, color: "#6b6b6b", fontSize: 12 }}>
            Feedback for: <b>{targetDate}</b>
          </div>

          <form
            onSubmit={onSave}
            style={{
              padding: "20px 36px",
              height: "calc(100% - 52px)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={question}
              style={{
                height: 200,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #d0d7cd",
                resize: "none",
                fontSize: 14,
                background: "rgba(255,255,255,0.6)",
                outline: "none",
                color: "#2E3832",
                fontWeight: 500,
              }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: buttonColor,
                color: textColor,
                width: 140,
                height: 42,
                borderRadius: 5,
                marginTop: "auto",
                alignSelf: "center",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 15,
                boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
                border: "none",
              }}
            >
              Save
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: "42%" }}>
          <img
            src={image}
            alt="Mood Background"
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
