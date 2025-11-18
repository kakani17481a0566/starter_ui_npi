import  { useEffect, useRef, useState } from "react";

// RecordingSession.jsx
// Default-exported React functional component styled with Tailwind CSS.
// - Opens user camera and microphone and shows a large preview
// - Records using MediaRecorder and stores blobs
// - Shows recorded video on the right pane; clicking it toggles playback
// - "Save session" uploads the recorded video blob to an API endpoint
// - "Exit full screen" calls onExit prop if provided, otherwise navigates back

export default function RecordingSession({
  exerciseName = "Exercise name",
  repsText = "6 * 2 sets minimum",
  durationText = "15 minutes",
  instructions = ["Instruction A", "Instruction B", "Instruction C"],
  maxSessions = 3,
  onExit,
  saveEndpoint = 'http://127.0.0.1:8000/uploadVideo', // change to your real endpoint
}) {
  const videoRef = useRef(null); // live camera
  const recordedRef = useRef(null); // recorded playback element
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [sessionsRecorded, setSessionsRecorded] = useState(2);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // start camera on mount
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Could not start camera", err);
        setError("Camera access denied or not available.");
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startRecording = () => {
    if (!stream) return;
    setRecordedBlob(null);
    chunksRef.current = [];

    try {
      const options = { mimeType: "video/webm;codecs=vp8,opus" };
      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);
        // increase session count (simulate)
        setSessionsRecorded((s) => Math.min(s + 1, maxSessions));
      };

      mr.start(100); // collect in 100ms chunks
      setRecording(true);
    } catch (err) {
      console.error("Recording failed", err);
      setError("Recording not supported in this browser.");
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    setRecording(false);
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  // Play recorded video when user clicks thumbnail
  const onClickRecorded = () => {
    // if (!recordedRef.current) return;
    if (recordedRef.current.paused) recordedRef.current.play();
    else recordedRef.current.pause();
  };

  const saveSession = async () => {
    if (!recordedBlob) {
      setError("No recording to save.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("video", recordedBlob, "session.webm");
      form.append("exercise", exerciseName);

      const resp = await fetch(saveEndpoint, {
        method: "POST",
        body: form,
      });

      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);

      // you can handle response JSON if needed
      setSaving(false);
      alert("Session saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save session.");
      setSaving(false);
    }
  };

  const handleExit = () => {
    // stop tracks
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (onExit && typeof onExit === "function") onExit();
    else window.history.back();
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 shadow-lg">
      <div className="bg-gray-700 text-white p-6 rounded-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-semibold">{exerciseName}</h2>
            <div className="text-sm opacity-80">{repsText}</div>
            <div className="text-sm opacity-80">{durationText}</div>
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
              onClick={() => alert("How this works: start/stop recording, save when finished.")}
            >
              How this works?
            </button>
            <button
              onClick={handleExit}
              className="ml-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-600"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="flex bg-white">
        {/* left: live preview with large displayed recording word overlay */}
        <div className="flex-1 relative">
          <div className="w-full h-[520px] bg-gray-100 overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl md:text-8xl font-extrabold text-white/80 tracking-wide select-none">
                RECORDING
                <br />
                SESSION
              </div>
            </div>
          </div>

          <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
            <div>
              <span className="opacity-80">Sessions recorded : </span>
              <span className="font-semibold">{sessionsRecorded < 10 ? `0${sessionsRecorded}` : sessionsRecorded}</span>
              <span className="text-yellow-300"> ( {maxSessions} max sessions )</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded shadow-md font-medium ${recording ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
              >
                {recording ? "Stop" : "Start"} recording
              </button>
              <button
                onClick={handleExit}
                className="px-4 py-2 rounded bg-blue-400 hover:bg-blue-500"
              >
                Exit full screen
              </button>
              <button
                onClick={saveSession}
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? "Saving..." : "Save session"}
              </button>
            </div>
          </div>
        </div>

        {/* right: recording details and playback */}
        <aside className="w-96 bg-sky-100 p-6">
          <div className="mb-4 text-center text-gray-700">Recording exercise session</div>
          <div className="mb-4">
            
              <video
                ref={recordedRef}
                src="/videos/Yoga Mini_ Dancer Pose.mp4"
                controls={false}
                className="w-full h-44 object-cover cursor-pointer rounded shadow"
                onClick={onClickRecorded}
              />
            {/* ) : (
              // placeholder image while no recorded video available
              <div className="w-full h-44 bg-gray-200 rounded flex items-center justify-center">
                <div className="text-sm text-gray-600">No recorded video yet</div>
              </div>
            )} */}
          </div>

          <h3 className="text-gray-800 font-semibold mb-2">Instructions to follow</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            {instructions.map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>

          {error && <div className="mt-4 text-red-600">{error}</div>}

          <div className="mt-6 text-sm text-gray-500">Tip: Click the thumbnail to toggle playback. Save to upload the video.</div>
        </aside>
      </div>
    </div>
  );
}
