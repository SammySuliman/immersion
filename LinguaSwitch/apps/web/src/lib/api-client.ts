import type { ChatResponse, LearnerProfile, ProgressSnapshot } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  createProfile(payload: Omit<LearnerProfile, "learnerId">) {
    return request<LearnerProfile>("/api/v1/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  sendTurn(payload: {
    learnerId: string;
    sessionId?: string;
    message: string;
  }) {
    return request<ChatResponse>("/api/v1/sessions/turn", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getProgress(learnerId: string) {
    return request<ProgressSnapshot>(`/api/v1/progress/${learnerId}`);
  },
  health() {
    return request<{ status: string }>("/health");
  },
};

