import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Web Speech API helper with:
 *  - voice discovery (prefers en-IN / hi-IN if present)
 *  - rate & pitch controls
 *  - safe queuing (cancels previous before speaking)
 */
export default function useTextToSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  // Load once and on voice list changes (Safari/Chrome lazy load voices)
  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices() || [];
      setVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Prepare a reusable utterance
    const utt = new SpeechSynthesisUtterance();
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    utteranceRef.current = utt;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Best-effort default: pick an Indian voice if available
  const defaultVoice = useMemo(() => {
    if (!voices.length) return null;

    const prefer = (v) =>
      v.lang?.toLowerCase().startsWith("en-in") ||
      v.lang?.toLowerCase().startsWith("hi-in") ||
      /india/i.test(v.name || "");

    return voices.find(prefer) || voices[0];
  }, [voices]);

  const speak = (text, options = {}) => {
    if (!isSupported || !text) return;
    const synth = window.speechSynthesis;
    const utt = utteranceRef.current || new SpeechSynthesisUtterance();

    
    if (synth.speaking || synth.pending) synth.cancel();

    // Assign options safely
    const {
      rate = 0.9, // slower for kids
      pitch = 1,
      voice, // a SpeechSynthesisVoice object
      lang,  // optional explicit lang override
      volume = 1,
    } = options;

    utt.text = text;
    utt.rate = rate;
    utt.pitch = pitch;
    utt.volume = volume;

    // Pick voice: explicit > default > fallback
    const chosenVoice =
      voice ||
      defaultVoice ||
      (voices.length ? voices[0] : null);

    if (chosenVoice) {
      utt.voice = chosenVoice;
      // Keep lang aligned with the voice if not explicitly set
      utt.lang = lang || chosenVoice.lang || "en-IN";
    } else {
      utt.lang = lang || "en-IN";
    }

    synth.speak(utt);
  };

  const cancel = () => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending) synth.cancel();
  };

  return { isSupported, speaking, voices, defaultVoice, speak, cancel };
}

