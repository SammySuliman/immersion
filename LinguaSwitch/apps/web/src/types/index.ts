export type SupportedLanguage = "Spanish" | "French" | "Korean";

export type LearnerProfile = {
  learnerId: string;
  name: string;
  nativeLanguage: string;
  targetLanguage: SupportedLanguage;
  proficiency: "Beginner" | "Elementary" | "Intermediate";
  targetRatio: number;
  goals: string;
};

export type SessionTurn = {
  role: "user" | "assistant";
  text: string;
  languageMix?: {
    nativeShare: number;
    targetShare: number;
  };
  highlightTerms?: string[];
};

export type ChatResponse = {
  sessionId: string;
  reply: string;
  actualRatio: {
    nativeShare: number;
    targetShare: number;
  };
  suggestedNextRatio: number;
  introducedTerms: string[];
  summaryTip: string;
};

export type ProgressSnapshot = {
  learnerId: string;
  sessionCount: number;
  averageTargetRatio: number;
  knownTerms: string[];
  recentTips: string[];
};

