"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api-client";
import { useLearnerSettings } from "@/hooks/use-learner-settings";
import type { ProgressSnapshot } from "@/types";

export default function ProgressPage() {
  const { profile } = useLearnerSettings();
  const [progress, setProgress] = useState<ProgressSnapshot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }

    apiClient
      .getProgress(profile.learnerId)
      .then(setProgress)
      .catch(() => setError("Progress is unavailable until the backend is running and at least one session exists."));
  }, [profile]);

  if (!profile) {
    return (
      <section className="emptyState">
        <p className="eyebrow">No profile</p>
        <h2>Onboard a learner to start tracking progress.</h2>
      </section>
    );
  }

  return (
    <section className="pageShell">
      <div className="pageIntro">
        <p className="eyebrow">Progress</p>
        <h1>{profile.name}&apos;s learning state</h1>
        <p>Stage 1 keeps a simple in-memory snapshot of sessions, ratio history, and introduced terms.</p>
      </div>
      {error ? <p>{error}</p> : null}
      {progress ? (
        <div className="progressGrid">
          <section className="sidePanel">
            <p className="eyebrow">Sessions</p>
            <h3>{progress.sessionCount}</h3>
            <p>Completed spoken turns tracked by the backend.</p>
          </section>
          <section className="sidePanel">
            <p className="eyebrow">Average exposure</p>
            <h3>{Math.round(progress.averageTargetRatio * 100)}%</h3>
            <p>Average target-language share across generated replies.</p>
          </section>
          <section className="sidePanel">
            <p className="eyebrow">Known terms</p>
            <h3>{progress.knownTerms.length}</h3>
            <p>{progress.knownTerms.join(", ") || "No terms stored yet."}</p>
          </section>
          <section className="sidePanel">
            <p className="eyebrow">Recent tips</p>
            <h3>Coach guidance</h3>
            <p>{progress.recentTips.join(" • ") || "No tips yet."}</p>
          </section>
        </div>
      ) : null}
    </section>
  );
}

