"use client";

import { useState } from "react";

import { apiClient } from "@/lib/api-client";
import type { ChatResponse } from "@/types";

export function useRealtimeSession() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendTurn = async (payload: {
    learnerId: string;
    sessionId?: string;
    message: string;
  }): Promise<ChatResponse | null> => {
    setPending(true);
    setError(null);

    try {
      return await apiClient.sendTurn(payload);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown error");
      return null;
    } finally {
      setPending(false);
    }
  };

  return { sendTurn, pending, error };
}

