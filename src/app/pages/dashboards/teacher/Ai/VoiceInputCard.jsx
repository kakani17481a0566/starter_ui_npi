import axios from "axios";
import { useState,useEffect } from "react";
export default function VoiceInputCard({ text, audioFile ,studentId, testContentId, testId, relationId}) {
  // const [responseAudioURL, setResponseAudioURL] = useState(null);
  const [textResult, setTextResult] = useState("");

  useEffect(() => {
  if (!audioFile || !text?.trim()) return;

const sendToAPI = async () => {
  const formData = new FormData();
  formData.append("audioFile", audioFile);

  try {
    // 1️⃣ Hit the first API (returns plain text: "correct" or "incorrect")
    const response = await axios.post(
      `https://localhost:7202/${text}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // response.data is just "correct" or "incorrect"
    const finalResult = response.data.trim().toLowerCase();

    console.log("First API result:", finalResult);
    console.log("This is voiceinputcard",testContentId);

    // 2️⃣ Send result to the second API
    await axios.post(
      "https://localhost:7202/api/TestResult",
      {
        studentId:studentId,
        testContentId:testContentId ,
        testId:testId,
        relationId:relationId,
        result: finalResult,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // 3️⃣ Show user-friendly text
    setTextResult(
      finalResult === "incorrect"
        ? "❌ Some words were mispronounced."
        : "✅ All words were pronounced correctly!"
    );
  } catch (error) {
    console.error("Upload failed:", error);
    setTextResult("❌ Upload failed: " + error.message);
  }
};


  sendToAPI();
}, [audioFile, text, studentId, testContentId, testId, relationId]);


  return (
    <div className="p-4 mt-4 bg-gray-100 rounded">
      {/* <h3 className="font-semibold text-primary-800">🧠 Feedback from Server</h3> */}

      {textResult && <p className="mt-2 text-sm">{textResult}</p>}

      {/* {responseAudioURL && (
        <audio controls src={responseAudioURL} autoPlay className="mt-2" />
      )} */}
    </div>
  );
}
