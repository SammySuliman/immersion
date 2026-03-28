from dataclasses import dataclass, field
from statistics import mean
from uuid import uuid4

from bilingual_bot.schemas.profile import LearnerProfile, ProfileCreate
from bilingual_bot.schemas.progress import ProgressSnapshot


@dataclass
class StoredSession:
    session_id: str
    learner_id: str
    turns: list[dict] = field(default_factory=list)
    ratios: list[float] = field(default_factory=list)
    tips: list[str] = field(default_factory=list)
    introduced_terms: list[str] = field(default_factory=list)


class InMemoryStore:
    def __init__(self) -> None:
        self.profiles: dict[str, LearnerProfile] = {}
        self.sessions: dict[str, StoredSession] = {}

    def create_profile(self, payload: ProfileCreate) -> LearnerProfile:
        learner_id = uuid4().hex
        profile = LearnerProfile(learnerId=learner_id, **payload.model_dump())
        self.profiles[learner_id] = profile
        return profile

    def get_profile(self, learner_id: str) -> LearnerProfile:
        return self.profiles[learner_id]

    def get_or_create_session(self, learner_id: str, session_id: str | None) -> StoredSession:
        if session_id and session_id in self.sessions:
            return self.sessions[session_id]

        next_session = StoredSession(session_id=uuid4().hex, learner_id=learner_id)
        self.sessions[next_session.session_id] = next_session
        return next_session

    def snapshot_progress(self, learner_id: str) -> ProgressSnapshot:
        learner_sessions = [session for session in self.sessions.values() if session.learner_id == learner_id]
        ratios = [ratio for session in learner_sessions for ratio in session.ratios]
        terms = []
        tips = []
        for session in learner_sessions:
            terms.extend(session.introduced_terms)
            tips.extend(session.tips[-2:])

        return ProgressSnapshot(
            learnerId=learner_id,
            sessionCount=sum(len(session.turns) // 2 for session in learner_sessions),
            averageTargetRatio=mean(ratios) if ratios else 0.0,
            knownTerms=sorted(set(terms)),
            recentTips=tips[-4:],
        )


store = InMemoryStore()
