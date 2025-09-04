import axios from "axios";
import { useState,useEffect } from "react";
export default function VoiceInputCard({ text, audioFile }) {
  const [responseAudioURL, setResponseAudioURL] = useState(null);
  const [textResult, setTextResult] = useState("");

  useEffect(() => {
    if (!audioFile || !text?.trim()) return;

    const sendToAPI = async () => {
      const formData = new FormData();
      formData.append("audioFile", audioFile);

      try {
        const response = await axios.post(
          `https://localhost:7202/api/Audio/upload/${text}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const { misPronouncedWords, rhymses } = response.data;
        const binaryString = atob(rhymses);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        const audioBlob = new Blob([byteArray], { type: "audio/wav" });
        const audioURL = URL.createObjectURL(audioBlob);
        setResponseAudioURL(audioURL);

        if (misPronouncedWords.length > 0) {
          setTextResult(`❌ Mispronounced or missing: ${misPronouncedWords.join(", ")}`);
        } else {
          setTextResult("✅ All words were pronounced correctly!");
        }

        new Audio(audioURL).play();
      } catch (error) {
        setTextResult("❌ Upload failed: " + error.message);
      }
    };

    sendToAPI();
  }, [audioFile, text]);

  return (
    <div className="p-4 mt-4 bg-gray-100 rounded">
      {/* <h3 className="font-semibold text-primary-800">🧠 Feedback from Server</h3> */}

      {textResult && <p className="mt-2 text-sm">{textResult}</p>}

      {responseAudioURL && (
        <audio controls src={responseAudioURL} autoPlay className="mt-2" />
      )}
    </div>
  );
}
