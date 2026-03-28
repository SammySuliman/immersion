from bilingual_bot.data.language_packs import LANGUAGE_PACKS
from bilingual_bot.schemas.profile import LearnerProfile


def _select_terms(target_language: str, ratio: float) -> list[str]:
    pack = LANGUAGE_PACKS[target_language]
    term_count = 1 if ratio <= 0.05 else 2 if ratio <= 0.15 else 3
    return pack["terms"][:term_count]


def _native_support_message(user_message: str) -> str:
    cleaned = user_message.strip().rstrip(".!?")
    return (
        f"I heard you say '{cleaned}'. "
        "I will answer mostly in your native language and add a small amount of the target language."
    )


def generate_reply(profile: LearnerProfile, user_message: str, ratio: float) -> tuple[str, list[str]]:
    pack = LANGUAGE_PACKS[profile.targetLanguage]
    terms = _select_terms(profile.targetLanguage, ratio)
    greeting = pack["greetings"][min(len(terms) - 1, len(pack["greetings"]) - 1)]
    bridge = pack["bridges"][min(len(terms) - 1, len(pack["bridges"]) - 1)]
    native_frame = _native_support_message(user_message)

    if ratio <= 0.05:
        reply = (
            f"{native_frame} {greeting}. {bridge}: {terms[0]}. "
            f"Say it once, then answer again in your own words."
        )
    elif ratio <= 0.15:
        reply = (
            f"{native_frame} {greeting}. {bridge}: {terms[0]} and {terms[1]}. "
            "Now respond with one short sentence and include one of those phrases."
        )
    else:
        reply = (
            f"{greeting}. {bridge}: {terms[0]}, {terms[1]}, and {terms[2]}. "
            "I still want clarity, but try answering with a slightly longer mixed-language sentence."
        )

    return reply, terms


def measure_ratio(reply: str, introduced_terms: list[str]) -> float:
    tokens = [token.strip(".,!?").lower() for token in reply.split()]
    if not tokens:
        return 0.0
    target_hits = sum(1 for token in tokens if token in {term.lower() for term in introduced_terms})
    return round(min(max(target_hits / len(tokens), 0.01 if introduced_terms else 0.0), 0.5), 2)


def coaching_tip(ratio: float) -> str:
    if ratio <= 0.05:
        return "Keep the target language in short bursts until recall feels automatic."
    if ratio <= 0.15:
        return "You can start embedding target phrases inside full native-language sentences."
    return "The learner is ready for longer mixed utterances with lighter native-language scaffolding."

