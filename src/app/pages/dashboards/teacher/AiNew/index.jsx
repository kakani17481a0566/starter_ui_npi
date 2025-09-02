import { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Mic, Square } from "lucide-react";
import VoiceInputCard from "../Ai/VoiceInputCard";
import { fetchImageGenerationText } from "../Ai/ImageGeneration/data";
import { useNavigate } from "react-router";
import axios from "axios";
import SecurityGuard from "components/security/SecurityGuard";

export default function AlphabetTutor({name}) {
  const [index, setIndex] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const navigate=useNavigate();


  const [setSpeakTick] = useState(0);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const generateImage = async (text) => {
    if (!text) return;
    setLoading(true);
    try {
      const apiEndpoint =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";
        // "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";
      const apiKey = "AIzaSyAgAIac62cChPU-sAmfbCjC79kz676dlhU";
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
      if (base64Image) setImageSrc(` ${base64Image} `);
       await uploadGeneratedImageSimple(base64Image, text);
    } catch (err) {
      console.error("Image generation failed:", err.message);
    } finally {
      setLoading(false);
    }
  };
  function base64ToBlob(dataUrl) {
  // supports "data:image/png;base64,AAAA" or raw base64 "AAAA"
  const hasPrefix = dataUrl.startsWith("data:");
  const [meta, b64] = hasPrefix ? dataUrl.split(",") : ["data:application/octet-stream;base64", dataUrl];
  const contentType = hasPrefix ? meta.match(/data:(.*?);base64/)[1] : "application/octet-stream";
  const byteStr = atob(b64);
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
  return new Blob([bytes], { type: contentType });
}
  async function uploadGeneratedImageSimple(base64Image, text) {
    const formData = new FormData();
     const blob = base64ToBlob(base64Image);
    formData.append("file", blob);
    // formData.append("test", text || "unknown");
    console.log(formData);

   try {
  const res = await axios.post(
    `https://localhost:7202/updateimage/${text}`,
    formData,
    // {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     "accept: text/plain"
    //   },
    // }
  );
  

  console.log("Upload success:", res.data);
} catch (err) {
  console.error("Upload failed:", err.response?.status, err.message);
}
}


  const handleImageLogic = async (item) => {
    if (!item) return;
    if (item?.url) {
      setImageSrc(item.url);
    } else {
      await generateImage(item.name);
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
    setSpeakTick(t => t + 1);
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
        setSpeakTick(t => t + 1);
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      var list=[];
      if(!name){
      list = await fetchImageGenerationText();
      }
      else{
        list=await fetchImageGenerationText();
      }
      setDataList(list || []);
      if (list && list.length > 0) {
        await handleImageLogic(list[0]);
        setSpeakTick(t => t + 1);
      }
    };
    init();
  }, []);

  const handleNext = async () => {
    const nextIndex = index + 1;
    if (nextIndex < dataList.length) {
      setIndex(nextIndex);
      await handleImageLogic(dataList[nextIndex]);
      setSpeakTick(t => t + 1);
    }
  };

  const handlePrevious = async () => {
    const prevIndex = Math.max(0, index - 1);
    setIndex(prevIndex);
    await handleImageLogic(dataList[prevIndex]);
    setSpeakTick(t => t + 1);
  };
  const handleSubmit=async()=>{
    navigate("/dashboards/result");
  }
  console.log(imageSrc);

  const currentItem = dataList[index];

  return (
    <SecurityGuard   title="Secure Exam / Alphabet Tutor"
      watermark={name}             // or pass nothing to use session user from getSessionData
      deferUntilArmed={true} >
  <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden bg-gray-100">
    {/* IMAGE PANE (fills available space) */}
    <div className="flex-1 bg-white rounded-none md:rounded-xl m-0 md:m-4 overflow-hidden">
      <div className="w-full h-[55dvh] md:h-full flex items-center justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : imageSrc ? (
          // Prefer <img> for images (no PDF zoom UI). If you must use iframe, see notes below.
          <img
            src={`data:image/png;base64, ${imageSrc} `}
            alt={currentItem?.name || "Generated image"}
            className="w-full h-full object-contain"
          />
          // If you MUST use iframe:
          // <iframe
          //   src={imageSrc}
          //   className="w-full h-full border-0"
          //   style={{ display: 'block' }}
          //   // sandbox="allow-scripts allow-pointer-lock"
          //   // scrolling="no" // not reliable; browser may override
          // />
        ) : (
          <p className="text-sm text-gray-500">No image yet</p>
        )}
      </div>
    </div>

    {/* CONTROLS PANE (the ONLY scroller) */}
    <aside className="w-full md:w-96 bg-white md:bg-transparent md:m-4 md:ml-0 md:rounded-xl flex flex-col 
                     h-[45dvh] md:h-[calc(100dvh-2rem)] overflow-y-auto p-4 gap-4">
      <div className="text-4xl font-bold text-center border p-4 rounded bg-gray-50 shadow">
        <span className="block py-2 px-4 border border-gray-300 rounded-lg bg-white">
          {currentItem?.name || "Loading..."}
        </span>
      </div>

      {recordedAudioURL && (
        <div>
          <h4 className="text-sm font-medium">🔊 Your Recording</h4>
          <audio controls src={recordedAudioURL} className="mt-2 w-full" />
        </div>
      )}

      <VoiceInputCard
        text={currentItem?.name || ""}
        audioFile={audioFile}
        isRecording={isRecording}
      />

      <div className="mt-4 flex justify-center">
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
        <button className="w-full bg-blue-600 text-white text-sm rounded py-2" onClick={handleSubmit}>Submit</button>
      </div>
    </aside>
  </div>
  </SecurityGuard>
);

}
