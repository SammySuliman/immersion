from typing import Literal

from pydantic import BaseModel, Field


SupportedLanguage = Literal["Spanish", "French", "Korean"]
Proficiency = Literal["Beginner", "Elementary", "Intermediate"]


class ProfileCreate(BaseModel):
    name: str = Field(min_length=1)
    nativeLanguage: str = Field(min_length=1)
    targetLanguage: SupportedLanguage
    proficiency: Proficiency
    targetRatio: float = Field(ge=0.01, le=0.5)
    goals: str = Field(min_length=1)


class LearnerProfile(ProfileCreate):
    learnerId: str

