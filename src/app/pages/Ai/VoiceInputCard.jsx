import { useState, useRef } from "react";
import { Card, Button } from "components/ui";
import { Mic, Square, UploadCloud } from "lucide-react";

export default function VoiceInputCard() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm", // We’ll convert to .wav later if needed
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      audioChunks.current = [];

      const file = new File([blob], "voice.wav", { type: "audio/wav" });
      setAudioURL(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/voice/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        console.log("Upload success:", result);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <Card className="p-6 space-y-4 text-primary-950 dark:text-white">
      <h2 className="text-lg font-semibold">🎤 Voice Input</h2>

      <div className="flex items-center gap-4">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          color={isRecording ? "error" : "primary"} // ✅ FIXED color from "red" to "error"
          className="flex items-center gap-2"
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4" /> Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" /> Start Recording
            </>
          )}
        </Button>

        {audioURL && (
          <a
            href={audioURL}
            download="voice.wav"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline"
          >
            <UploadCloud className="h-4 w-4" /> Download Recording
          </a>
        )}
      </div>

      {isRecording && (
        <div className="text-sm text-red-500 animate-pulse">
          Recording... speak now
        </div>
      )}
    </Card>
  );
}
