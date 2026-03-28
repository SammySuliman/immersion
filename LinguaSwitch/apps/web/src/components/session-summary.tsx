type Props = {
  tip: string;
  nextRatio: number;
};

export function SessionSummary({ tip, nextRatio }: Props) {
  return (
    <section className="sidePanel">
      <p className="eyebrow">Coach Note</p>
      <h3>Next adjustment</h3>
      <p>{tip}</p>
      <strong>{Math.round(nextRatio * 100)}% target on the next step</strong>
    </section>
  );
}

