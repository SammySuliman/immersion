from fastapi import APIRouter, HTTPException

from bilingual_bot.schemas.profile import LearnerProfile, ProfileCreate
from bilingual_bot.schemas.progress import ProgressSnapshot
from bilingual_bot.schemas.session import RatioSnapshot, TurnRequest, TurnResponse
from bilingual_bot.services.ratio_policy import suggested_ratio
from bilingual_bot.services.response_engine import coaching_tip, generate_reply, measure_ratio
from bilingual_bot.services.store import store

router = APIRouter(prefix="/api/v1")


@router.post("/profile", response_model=LearnerProfile)
def create_profile(payload: ProfileCreate) -> LearnerProfile:
    return store.create_profile(payload)


@router.post("/sessions/turn", response_model=TurnResponse)
def create_turn(payload: TurnRequest) -> TurnResponse:
    try:
        profile = store.get_profile(payload.learnerId)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Learner profile not found.") from exc

    session = store.get_or_create_session(payload.learnerId, payload.sessionId)
    next_ratio = suggested_ratio(profile, successful_turns=len(session.turns) // 2)
    reply, terms = generate_reply(profile, payload.message, next_ratio)
    actual_target = measure_ratio(reply, terms)
    tip = coaching_tip(next_ratio)

    session.turns.append({"role": "user", "text": payload.message})
    session.turns.append({"role": "assistant", "text": reply})
    session.ratios.append(actual_target)
    session.introduced_terms.extend(terms)
    session.tips.append(tip)

    return TurnResponse(
        sessionId=session.session_id,
        reply=reply,
        actualRatio=RatioSnapshot(nativeShare=round(1 - actual_target, 2), targetShare=actual_target),
        suggestedNextRatio=suggested_ratio(profile, successful_turns=len(session.turns) // 2),
        introducedTerms=terms,
        summaryTip=tip,
    )


@router.get("/progress/{learner_id}", response_model=ProgressSnapshot)
def get_progress(learner_id: str) -> ProgressSnapshot:
    try:
        store.get_profile(learner_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Learner profile not found.") from exc

    return store.snapshot_progress(learner_id)

