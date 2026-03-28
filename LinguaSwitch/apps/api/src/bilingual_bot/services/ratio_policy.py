from bilingual_bot.schemas.profile import LearnerProfile


def suggested_ratio(profile: LearnerProfile, successful_turns: int) -> float:
    base = profile.targetRatio
    proficiency_bonus = {
        "Beginner": 0.0,
        "Elementary": 0.04,
        "Intermediate": 0.08,
    }[profile.proficiency]

    session_bonus = min(successful_turns * 0.01, 0.08)
    return round(min(max(base + proficiency_bonus + session_bonus, 0.01), 0.5), 2)

