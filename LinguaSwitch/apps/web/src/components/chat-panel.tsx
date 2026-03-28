"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MicrophoneButton } from "@/components/microphone-button";
import { PlaybackControls } from "@/components/playback-controls";
import { RatioMeter } from "@/components/ratio-meter";
import { SessionSummary } from "@/components/session-summary";
import { TranscriptView } from "@/components/transcript-view";
import { VocabularyCard } from "@/components/vocabulary-card";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useLearnerSettings } from "@/hooks/use-learner-settings";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { useTtsPlayer } from "@/hooks/use-tts-player";
import type { SessionTurn } from "@/types";

const recognitionLangMap: Record<string, string> = {
  Spanish: "es-ES",
  French: "fr-FR",
  Korean: "ko-KR",
};

const speechLangMap: Record<string, string> = {
  Spanish: "es-ES",
  French: "fr-FR",
  Korean: "ko-KR",
};

export function ChatPanel() {
  const router = useRouter();
  const { profile } = useLearnerSettings();
  const { sendTurn, pending, error } = useRealtimeSession();
  const { supported, isRecording, interimTranscript, startRecording, stopRecording } =
    useAudioRecorder();
  const { supported: ttsSupported, speaking, speak } = useTtsPlayer();
  const [turns, setTurns] = useState<SessionTurn[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [lastReply, setLastReply] = useState("");
  const [lastActualRatio, setLastActualRatio] = useState<number | undefined>(undefined);
  const [introducedTerms, setIntroducedTerms] = useState<string[]>([]);
  const [tip, setTip] = useState("The coach will tune the target-language load after your first turn.");
  const [nextRatio, setNextRatio] = useState(profile?.targetRatio ?? 0.01);

  const disabled = useMemo(() => !profile || pending || !supported, [pending, profile, supported]);

  if (!profile) {
    return (
      <section className="emptyState">
        <p className="eyebrow">Setup required</p>
        <h2>Create a learner profile first</h2>
        <button className="primaryButton" onClick={() => router.push("/onboarding")} type="button">
          Go to onboarding
        </button>
      </section>
    );
  }

  const handleMicClick = async () => {
    if (isRecording) {
      const result = stopRecording();
      if (!result.transcript) {
        return;
      }

      const nextUserTurn: SessionTurn = { role: "user", text: result.transcript };
      setTurns((current) => [...current, nextUserTurn]);

      const response = await sendTurn({
        learnerId: profile.learnerId,
        sessionId,
        message: result.transcript,
      });

      if (!response) {
        return;
      }

      setSessionId(response.sessionId);
      setLastReply(response.reply);
      setLastActualRatio(response.actualRatio.targetShare);
      setIntroducedTerms(response.introducedTerms);
      setTip(response.summaryTip);
      setNextRatio(response.suggestedNextRatio);

      setTurns((current) => [
        ...current,
        {
          role: "assistant",
          text: response.reply,
          highlightTerms: response.introducedTerms,
          languageMix: response.actualRatio,
        },
      ]);

      speak(response.reply, speechLangMap[profile.targetLanguage] ?? "en-US");
      return;
    }

    startRecording(recognitionLangMap[profile.targetLanguage] ?? "en-US");
  };

  return (
    <div className="workspaceGrid">
      <div className="workspaceMain">
        <TranscriptView interimTranscript={interimTranscript} turns={turns} />
      </div>
      <aside className="workspaceSide">
        <RatioMeter actualRatio={lastActualRatio} targetRatio={profile.targetRatio} />
        <section className="controlPanel">
          <p className="eyebrow">Voice loop</p>
          <h3>Speak, stop, send</h3>
          <MicrophoneButton active={isRecording} disabled={disabled} onClick={handleMicClick} />
          {!supported ? <p>Speech recognition is unavailable in this browser.</p> : null}
          {error ? <p>{error}</p> : null}
          {!ttsSupported ? <p>Speech synthesis is unavailable in this browser.</p> : null}
        </section>
        <VocabularyCard terms={introducedTerms} />
        <PlaybackControls
          disabled={!lastReply}
          onReplay={() => speak(lastReply, speechLangMap[profile.targetLanguage] ?? "en-US")}
          speaking={speaking}
        />
        <SessionSummary nextRatio={nextRatio} tip={tip} />
      </aside>
    </div>
  );
}

