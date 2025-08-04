import VoiceInputCard from "../VoiceInputCard";
import { fetchImageGenerationText } from "./data";
import { useState, useEffect,useRef } from "react";
import RecordRTC from "recordrtc";


export default function ImageGeneration() {
  const [index, setIndex] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [combinedText, setCombinedText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);


  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const generateImage = async (text) => {
    if (!text) return;


    const apiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";
    const apiKey = "AIzaSyADRBX3vm2b-p2VRGkPeDd7ilViG3i6sD4"; // Replace with your actual Gemini API key

    const prompt = `Generate a ${text}  image with ${text} word with kids`;

    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.message}`);
      }

      const result = await response.json();
      const base64Image = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

      if (base64Image) {
        const imageSrc = `data:image/png;base64,${base64Image}`;
        setSrc(imageSrc);
      } else {
        console.error("No image data received.");
      }
    } catch (error) {
      console.error("Gemini image generation failed:", error.message);
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  const getDataAndGenerateFirst = async () => {
    const response = await fetchImageGenerationText();
    setDataList(response);
    if (response.length > 0) {
      const firstWord = response[0];
      setCombinedText(firstWord); // Set initial combined text
      console.log("Combined Text:", firstWord);
      await generateImage(response[0]);
    }
  };
  getDataAndGenerateFirst();
}, []);

const handleNext = async () => {
  const nextIndex = index + 1;
  setIndex(nextIndex);
  const nextWord = dataList[nextIndex];
  setCombinedText((prevText) => {
    const updated = `${prevText} ${nextWord}`;
    console.log("Combined Text:", updated);
    return updated;
  });
  await generateImage(nextWord); 
}

const handlePrevious = async () => {
  const prevIndex = (index - 1 + dataList.length) % dataList.length;
  setIndex(prevIndex);
  await generateImage(dataList[prevIndex]);
};
console.log("the test is ", combinedText);

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  streamRef.current = stream;

  const recorder = new RecordRTC(stream, {
    type: "audio",
    mimeType: "audio/wav",
    recorderType: RecordRTC.StereoAudioRecorder,
    desiredSampRate: 16000,
  });

  recorder.startRecording();
  recorderRef.current = recorder;
  setIsRecording(true);
  setAudioFile(null); // reset previous
};

// ⏹️ Stop recording
const stopRecording = async () => {
  const recorder = recorderRef.current;

  if (recorder) {
    await recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      const wavFile = new File([blob], "voice.wav", { type: "audio/wav" });

      setAudioFile(wavFile);
       const audioURL = URL.createObjectURL(blob); 
      setRecordedAudioURL(audioURL);   
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    });
  }
}

return (
  <div style={{ textAlign: "center" }}>
    <h2>Generated Images</h2>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <img
        src={src}
        alt="AI generated"
        style={{ width: "300px", height: "auto", borderRadius: "8px" }}
      />
    )}
    <div style={{ marginTop: "20px" }}>
      <button onClick={handlePrevious} disabled={loading}>
        ⬅️ Previous
      </button>
      <span style={{ margin: "0 12px", fontWeight: "bold" }}>
        {dataList[index]?.name ?? "Loading..."}
      </span>
      <button onClick={handleNext} disabled={loading}>
        Next ➡️
      </button>
    </div>
    <div style={{ marginTop: "30px" }}>
      <h3>🎙️ Record Your Voice</h3>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          backgroundColor: isRecording ? "red" : "green",
          color: "white",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
      </button>
      {isRecording && <p style={{ color: "red", marginTop: "10px" }}>Recording... Speak now</p>}
    </div>
    {recordedAudioURL && (
  <div style={{ marginTop: "20px" }}>
    <h4>🔊 Listen to Your Recording</h4><audio controls src={recordedAudioURL}></audio>
  </div>
    )}

    <div className="mt-6">
      <VoiceInputCard text={combinedText} audioFile={audioFile} />
    </div>
    <div>
      Pronounced Words:{combinedText}
    </div>
  </div>
);
}
