from pydantic import BaseModel, Field


class TurnRequest(BaseModel):
    learnerId: str
    sessionId: str | None = None
    message: str = Field(min_length=1)


class RatioSnapshot(BaseModel):
    nativeShare: float
    targetShare: float


class TurnResponse(BaseModel):
    sessionId: str
    reply: str
    actualRatio: RatioSnapshot
    suggestedNextRatio: float
    introducedTerms: list[str]
    summaryTip: str

