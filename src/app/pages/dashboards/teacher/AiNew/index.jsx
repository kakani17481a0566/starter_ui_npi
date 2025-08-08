import { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Mic, Square } from "lucide-react";
import VoiceInputCard from "../Ai/VoiceInputCard";
import { fetchImageGenerationText } from "../Ai/ImageGeneration/data";

export default function AlphabetTutor() {
  const [index, setIndex] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [combinedText, setCombinedText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const generateImage = async (text) => {
    if (!text) return;
    setLoading(true);
    try {
      const apiEndpoint =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";
      const apiKey = "AIzaSyDfTNmGdgr5d0nq9v8YVYwbgt8WjDQOOds";
      const prompt = `Generate a ${text} image with ${text} word with kids`;
      const response = await fetch(`${apiEndpoint}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      });
      const result = await response.json();
      const base64Image = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (base64Image) setImageSrc(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error("Image generation failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

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
    setAudioFile(null);
  };

  const stopRecording = async () => {
    const recorder = recorderRef.current;
    if (recorder) {
      await recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const wavFile = new File([blob], "voice.wav", { type: "audio/wav" });
        setAudioFile(wavFile);
        setRecordedAudioURL(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      const list = await fetchImageGenerationText();
      setDataList(list);
      if (list.length > 0) {
        setCombinedText(list[0]);
        await generateImage(list[0]);
      }
    };
    init();
  }, []);

  const handleNext = async () => {
    const nextIndex = index + 1;
    if (nextIndex < dataList.length) {
      setIndex(nextIndex);
      setCombinedText((prev) => `${prev} ${dataList[nextIndex]}`);
      await generateImage(dataList[nextIndex]);
    }
  };

  const handlePrevious = async () => {
    const prevIndex = Math.max(0, index - 1);
    setIndex(prevIndex);
    await generateImage(dataList[prevIndex]);
  };

  return (
   <div className="flex min-h-screen w-full bg-gray-100 p-4 gap-4 overflow-hidden">
      <div className="flex-1 bg-white rounded-xl flex items-center justify-center relative overflow-hidden">
        {loading ? <p>Loading...</p> : (
          <img src={imageSrc} alt="Generated" className="max-h-full max-w-full object-contain rounded-xl" />
        )}
      </div>

      <div className="w-96 flex flex-col overflow-y-auto max-h-screen">
        <div className="text-4xl font-bold text-center border p-4 rounded mb-4 bg-gray-50 shadow">
          <span className="block py-2 px-4 border border-gray-300 rounded-lg bg-white">{dataList[index] || "Loading..."}</span>
        </div>

        {recordedAudioURL && (
          <div className="mb-4">
            <h4 className="text-sm font-medium">🔊 Your Recording</h4>
            <audio controls src={recordedAudioURL} className="mt-2 w-full" />
          </div>
        )}

        <VoiceInputCard text={combinedText} audioFile={audioFile} />

        <div className="mt-8 flex justify-center mb-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full p-6 ${isRecording ? "bg-red-600" : "bg-green-600"}`}
          >
            {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
          </button>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between gap-2 mb-2">
            <button onClick={handlePrevious} className="border text-xs rounded px-3 py-2">⬅️ Prev</button>
            <button onClick={handleNext} className="border text-xs rounded px-3 py-2">Next ➡️</button>
          </div>
          <button className="w-full bg-blue-600 text-white text-sm rounded py-2">Submit</button>
        </div>
      </div>
    </div>
  );
}
