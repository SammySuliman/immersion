"""
Build a compact GLUECoS-sourced dataset for Vertex AI Gemini supervised tuning.

Sources (no Twitter API):
  - LID-style: FIRE 2013 Hindi–English lines (same files used by GLUECoS LID_EN_HI pipeline).
  - NER-style: annotatedData.csv from GLUECoS NER_EN_HI upstream (SilentFlame NER repo).

Output: Vertex text tuning JSONL (systemInstruction + contents with user/model turns).
"""

from __future__ import annotations

import csv
import json
import random
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
OUT = ROOT / "gluecos_vertex_cut"

SYSTEM_LID = (
    "You are LinguaSwitch Coach. The learner mixes Hindi and English (Roman script). "
    "When asked, label each token as EN, HI, or OTHER. Reply with space-separated "
    "token/LABEL pairs only, in order, on one line."
)

SYSTEM_NER = (
    "You are LinguaSwitch Coach. For Hindi–English code-mixed text, label each token "
    "with its NER tag using IOB tags (e.g. B-Per, I-Org, Other). Reply with "
    "space-separated token/TAG pairs only, in order, on one line."
)


@dataclass(frozen=True)
class ChatExample:
    system: str
    user: str
    model: str

    def to_vertex_line(self) -> str:
        obj = {
            "systemInstruction": {
                "role": "system",
                "parts": [{"text": self.system}],
            },
            "contents": [
                {"role": "user", "parts": [{"text": self.user}]},
                {"role": "model", "parts": [{"text": self.model}]},
            ],
        }
        return json.dumps(obj, ensure_ascii=False)


def parse_fire_line(line: str) -> list[tuple[str, str]]:
    """FIRE format: word\\hi, word\\en, word\\NE, etc."""
    tokens: list[tuple[str, str]] = []
    for part in line.strip().split():
        if "\\" not in part:
            continue
        word, rest = part.split("\\", 1)
        rest_low = rest.lower()
        if rest_low.startswith("en") or rest_low == "e":
            tag = "EN"
        elif rest_low.startswith("hi") or rest_low.startswith("h=") or rest_low == "h":
            tag = "HI"
        else:
            tag = "OTHER"
        tokens.append((word, tag))
    return tokens


def load_lid_examples(paths: list[Path]) -> list[ChatExample]:
    out: list[ChatExample] = []
    for path in paths:
        if not path.exists():
            continue
        for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
            raw = raw.strip()
            if not raw:
                continue
            pairs = parse_fire_line(raw)
            if len(pairs) < 3:
                continue
            sentence = " ".join(w for w, _ in pairs)
            labels = " ".join(f"{w}/{t}" for w, t in pairs)
            user = (
                "Task: token language IDs (EN/HI/OTHER).\n"
                f'Utterance: "{sentence}"'
            )
            out.append(ChatExample(SYSTEM_LID, user, labels))
    return out


def load_ner_examples(csv_path: Path) -> list[ChatExample]:
    rows: list[tuple[str, str, str]] = []
    with csv_path.open(encoding="utf-8", errors="replace", newline="") as f:
        reader = csv.reader(f)
        header = next(reader, None)
        if not header:
            return []
        for row in reader:
            if len(row) < 3:
                continue
            sid, word, tag = row[0].strip(), row[1].strip(), row[2].strip()
            if not sid or not word:
                continue
            rows.append((sid, word, tag))

    by_sent: dict[str, list[tuple[str, str]]] = {}
    for sid, word, tag in rows:
        m = re.match(r"sent:\s*(\d+)", sid, re.I)
        if not m:
            continue
        key = m.group(1)
        by_sent.setdefault(key, []).append((word, tag))

    out: list[ChatExample] = []
    for key in sorted(by_sent.keys(), key=int):
        pairs = by_sent[key]
        if len(pairs) < 3:
            continue
        sentence = " ".join(w for w, _ in pairs)
        if len(sentence) > 512:
            continue
        labels = " ".join(f"{w}/{t.replace(' ', '_')}" for w, t in pairs)
        user = (
            "Task: token-level NER in code-mixed Hindi–English.\n"
            f'Utterance: "{sentence}"'
        )
        out.append(ChatExample(SYSTEM_NER, user, labels))
    return out


def main() -> None:
    random.seed(42)

    lid_paths = [
        SOURCE / "HindiEnglish_FIRE2013_AnnotatedDev.txt",
        SOURCE / "HindiEnglish_FIRE2013_Test_GT.txt",
    ]
    lid_all = load_lid_examples(lid_paths)

    ner_path = SOURCE / "annotatedData.csv"
    ner_all = load_ner_examples(ner_path) if ner_path.exists() else []

    # Sized for ~60 min supervised tuning on Gemini: ~900–1500 train rows typical.
    TARGET_LID_TRAIN, TARGET_LID_VAL = 650, 80
    TARGET_NER_TRAIN, TARGET_NER_VAL = 450, 60

    random.shuffle(lid_all)
    random.shuffle(ner_all)

    lid_train = lid_all[:TARGET_LID_TRAIN]
    lid_val = lid_all[TARGET_LID_TRAIN : TARGET_LID_TRAIN + TARGET_LID_VAL]
    ner_train = ner_all[:TARGET_NER_TRAIN]
    ner_val = ner_all[TARGET_NER_TRAIN : TARGET_NER_TRAIN + TARGET_NER_VAL]

    train = lid_train + ner_train
    val = lid_val + ner_val
    random.shuffle(train)
    random.shuffle(val)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "train.jsonl").write_text(
        "\n".join(ex.to_vertex_line() for ex in train) + ("\n" if train else ""),
        encoding="utf-8",
    )
    (OUT / "validation.jsonl").write_text(
        "\n".join(ex.to_vertex_line() for ex in val) + ("\n" if val else ""),
        encoding="utf-8",
    )

    manifest = {
        "train_examples": len(train),
        "validation_examples": len(val),
        "lid_train": len(lid_train),
        "lid_val": len(lid_val),
        "ner_train": len(ner_train),
        "ner_val": len(ner_val),
        "sources": {
            "fire_lid": [str(p.name) for p in lid_paths if p.exists()],
            "ner_csv": str(ner_path.name) if ner_path.exists() else None,
        },
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
