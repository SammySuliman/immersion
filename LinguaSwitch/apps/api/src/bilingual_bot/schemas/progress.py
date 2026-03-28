from pydantic import BaseModel


class ProgressSnapshot(BaseModel):
    learnerId: str
    sessionCount: int
    averageTargetRatio: float
    knownTerms: list[str]
    recentTips: list[str]

