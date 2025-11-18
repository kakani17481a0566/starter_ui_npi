import { useState } from "react";
import { toast } from "sonner";
import { saveMood } from "./data";

export default function MoodCard({
  title = "How are you feeling today?",
  placeholder = "Tell us how you’re feeling today...",
  themeColor = "#5d8b63",
  buttonColor = "#89a894",
  textColor = "#1e2c22",
}) {
  const [text, setText] = useState("");

  const onSave = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Please share your thoughts.");
      return;
    }

    toast.promise(saveMood(text), {
      loading: "Saving your response...",
      success: (res) => {
        setText("");
        return res.message || "Saved successfully!";
      },
      error: "Something went wrong!",
    });
  };

  return (
    <div
      className="flex items-center justify-center h-screen font-sans relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #EFFCEC, #EFFCEC)",
      }}
    >
      {/* 🌿 Background SVG overlay */}
      <div
        className="absolute inset-0 bg-[url('/images/nutration/Bg_for_feedback_cards.svg')] bg-center  opacity-40 pointer-events-none"
        // 👆 Reduced opacity here (20%) to keep background subtle
      ></div>

      {/* 🧠 Feedback Form */}
      <form
        onSubmit={onSave}
        className="relative z-10 w-[450px] bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* 🏷️ Dynamic Header */}
        <div
          className="text-white text-center py-3 rounded-t-xl"
          style={{ backgroundColor: themeColor }}
        >
          <h2 className="text-lg font-bold">
            {title} <span className="text-white">*</span>
          </h2>
        </div>

        {/* ✍️ Text Area */}
        <textarea
          className="w-[90%] mx-auto my-4 block h-32 p-3 text-[15px] rounded-md border border-gray-300 outline-none resize-none placeholder-gray-400 font-medium focus:ring-2 focus:ring-green-300"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>

        {/* 💾 Save Button */}
        <button
          type="submit"
          className="block mx-auto mb-4 px-6 py-2 font-bold text-[16px]  rounded-md shadow-md hover:opacity-90 transition"
          style={{
            backgroundColor: buttonColor,
            color: textColor,
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
}
