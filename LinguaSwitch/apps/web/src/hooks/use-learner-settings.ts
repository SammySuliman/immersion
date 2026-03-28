"use client";

import { useEffect, useState } from "react";

import type { LearnerProfile } from "@/types";

const STORAGE_KEY = "linguaswitch-profile";

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storage = window.localStorage;
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return null;
  }

  return storage;
}

export function useLearnerSettings() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const storage = getBrowserStorage();
    if (!storage) {
      return;
    }

    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      setProfile(JSON.parse(stored) as LearnerProfile);
    } catch {
      storage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveProfile = (nextProfile: LearnerProfile) => {
    const storage = getBrowserStorage();
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    }
    setProfile(nextProfile);
  };

  return { profile, saveProfile };
}
