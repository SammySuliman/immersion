"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client";
import { useLearnerSettings } from "@/hooks/use-learner-settings";
import type { SupportedLanguage } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { saveProfile } = useLearnerSettings();
  const [name, setName] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>("Spanish");
  const [proficiency, setProficiency] = useState<"Beginner" | "Elementary" | "Intermediate">(
    "Beginner",
  );
  const [targetRatio, setTargetRatio] = useState(0.01);
  const [goals, setGoals] = useState("Practice daily conversation with a gentle ramp-up.");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const profile = await apiClient.createProfile({
        name,
        nativeLanguage,
        targetLanguage,
        proficiency,
        targetRatio,
        goals,
      });
      saveProfile(profile);
      router.push("/session");
    } catch {
      setError("Unable to create learner profile. Check that the backend is running.");
    }
  };

  return (
    <section className="formShell">
      <div className="formIntro">
        <p className="eyebrow">Onboarding</p>
        <h1>Set the first language mix.</h1>
        <p>
          This Stage 1 flow stores a lightweight learner profile and uses it to tune the bilingual
          response policy.
        </p>
      </div>
      <form className="profileForm" onSubmit={handleSubmit}>
        <label>
          Name
          <input onChange={(event) => setName(event.target.value)} required value={name} />
        </label>
        <label>
          Native language
          <input
            onChange={(event) => setNativeLanguage(event.target.value)}
            value={nativeLanguage}
          />
        </label>
        <label>
          Target language
          <select
            onChange={(event) => setTargetLanguage(event.target.value as SupportedLanguage)}
            value={targetLanguage}
          >
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Korean">Korean</option>
          </select>
        </label>
        <label>
          Proficiency
          <select
            onChange={(event) =>
              setProficiency(event.target.value as "Beginner" | "Elementary" | "Intermediate")
            }
            value={proficiency}
          >
            <option value="Beginner">Beginner</option>
            <option value="Elementary">Elementary</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </label>
        <label>
          Starting target-language ratio: {Math.round(targetRatio * 100)}%
          <input
            max="0.5"
            min="0.01"
            onChange={(event) => setTargetRatio(Number(event.target.value))}
            step="0.01"
            type="range"
            value={targetRatio}
          />
        </label>
        <label>
          Goal
          <textarea onChange={(event) => setGoals(event.target.value)} rows={4} value={goals} />
        </label>
        {error ? <p>{error}</p> : null}
        <button className="primaryButton" type="submit">
          Save profile
        </button>
      </form>
    </section>
  );
}

