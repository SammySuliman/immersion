"use client";

type Props = {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function MicrophoneButton({ active, disabled, onClick }: Props) {
  return (
    <button
      className={`micButton ${active ? "micButtonActive" : ""}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="micCore" />
      <span>{active ? "Stop listening" : "Start speaking"}</span>
    </button>
  );
}

