"use client";

type Props = {
  disabled?: boolean;
  speaking: boolean;
  onReplay: () => void;
};

export function PlaybackControls({ disabled, speaking, onReplay }: Props) {
  return (
    <section className="sidePanel">
      <p className="eyebrow">Audio</p>
      <h3>Assistant voice</h3>
      <button className="secondaryButton" disabled={disabled} onClick={onReplay} type="button">
        {speaking ? "Speaking..." : "Replay last reply"}
      </button>
    </section>
  );
}

