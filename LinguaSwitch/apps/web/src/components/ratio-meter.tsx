import { formatRatio } from "@/lib/formatters";

type Props = {
  targetRatio: number;
  actualRatio?: number;
};

export function RatioMeter({ targetRatio, actualRatio }: Props) {
  return (
    <section className="ratioPanel">
      <div>
        <p className="eyebrow">Language Blend</p>
        <h3>Controlled code switching</h3>
      </div>
      <div className="ratioBars">
        <div>
          <span>Goal</span>
          <strong>{formatRatio(targetRatio)}</strong>
        </div>
        <div className="barTrack">
          <div className="barFill" style={{ width: `${targetRatio * 100}%` }} />
        </div>
        <div>
          <span>Last reply</span>
          <strong>{actualRatio !== undefined ? formatRatio(actualRatio) : "Waiting for first reply"}</strong>
        </div>
        <div className="barTrack muted">
          <div
            className="barFill secondary"
            style={{ width: `${(actualRatio ?? 0) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}

