"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SpeechRecognitionResult = {
  transcript: string;
};

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
    resultIndex: number;
  }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  }
}

export function useAudioRecorder() {
  const recognitionRef = useRef<Recognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const supported = useMemo(
    () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  useEffect(() => {
    if (!supported) {
      return;
    }

    const RecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!RecognitionCtor) {
      return;
    }
    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let nextInterim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const value = event.results[index][0]?.transcript ?? "";
        nextInterim += value;
      }
      setInterimTranscript(nextInterim.trim());
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [supported]);

  const startRecording = (lang: string) => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current.lang = lang;
    setInterimTranscript("");
    setError(null);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = (): SpeechRecognitionResult => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    return { transcript: interimTranscript.trim() };
  };

  return {
    supported,
    isRecording,
    interimTranscript,
    error,
    startRecording,
    stopRecording,
  };
}
