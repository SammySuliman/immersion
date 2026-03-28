import type { SessionTurn } from "@/types";

type Props = {
  turns: SessionTurn[];
  interimTranscript: string;
};

export function TranscriptView({ turns, interimTranscript }: Props) {
  return (
    <section className="transcriptPanel">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Session</p>
          <h2>Live conversation</h2>
        </div>
      </div>
      <div className="transcriptList">
        {turns.map((turn, index) => (
          <article
            className={`turn ${turn.role === "assistant" ? "assistantTurn" : "userTurn"}`}
            key={`${turn.role}-${index}`}
          >
            <span className="turnRole">{turn.role === "assistant" ? "Coach" : "You"}</span>
            <p>{turn.text}</p>
            {turn.highlightTerms?.length ? (
              <small>Focus terms: {turn.highlightTerms.join(", ")}</small>
            ) : null}
          </article>
        ))}
        {interimTranscript ? (
          <article className="turn userTurn pendingTurn">
            <span className="turnRole">Listening</span>
            <p>{interimTranscript}</p>
          </article>
        ) : null}
      </div>
    </section>
  );
}

