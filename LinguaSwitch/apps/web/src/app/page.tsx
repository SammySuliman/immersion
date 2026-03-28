import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <div className="heroCopy">
        <p className="eyebrow">Stage 1 MVP</p>
        <h1>Train a second language through controlled bilingual conversation.</h1>
        <p className="heroText">
          LinguaSwitch starts almost entirely in your native language, then gradually pushes more of
          the target language into live spoken dialogue as your comprehension improves.
        </p>
        <div className="heroActions">
          <Link className="primaryButton" href="/onboarding">
            Create learner profile
          </Link>
          <Link className="secondaryButton" href="/session">
            Open live session
          </Link>
        </div>
      </div>
      <div className="heroVisual">
        <div className="heroPanel">
          <span>99:1</span>
          <p>Start almost entirely in the learner&apos;s native language.</p>
        </div>
        <div className="heroPanel accent">
          <span>90:10</span>
          <p>Advance only when the learner is handling the new vocabulary cleanly.</p>
        </div>
        <div className="heroPanel">
          <span>Voice-first</span>
          <p>Speak in, hear the coach back, and review the new terms that were introduced.</p>
        </div>
      </div>
    </section>
  );
}

