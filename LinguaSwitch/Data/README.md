# GLUECoS-derived Vertex tuning cut (60-minute class jobs)

This folder holds a **small supervised fine-tuning** pack for **Vertex AI Gemini** text tuning, built from **GLUECoS-related public sources** that do **not** require the Twitter API.

## What you have

| File / folder | Purpose |
|---------------|---------|
| `gluecos_vertex_cut/train.jsonl` | **1,100** examples (Vertex `systemInstruction` + `contents` format) |
| `gluecos_vertex_cut/validation.jsonl` | **140** examples for tuning validation |
| `gluecos_vertex_cut/manifest.json` | Counts and source filenames |
| `build_vertex_cut.py` | Regenerates JSONL from `source/` |
| `source/` | Raw mirrors (re-downloadable) |

## Provenance (read before production use)

- **Language ID lines:** FIRE 2013 Hindi–English annotated/dev/test text files (`HindiEnglish_FIRE2013_*.txt`), the same upstream style used in the **GLUECoS LID_EN_HI** pipeline ([microsoft/GLUECoS](https://github.com/microsoft/GLUECoS)). IIT hosting terms apply to the FIRE files.
- **NER lines:** `annotatedData.csv` from the **SilentFlame NER** repository, the upstream used for **GLUECoS NER_EN_HI** processing. Check that repo’s license before commercial use.

The official GLUECoS **preprocessed** splits often assume Twitter scraping; this cut uses **only** sources that are fetchable without Twitter credentials, while staying aligned with GLUECoS’s **English–Hindi** code-mixed tasks.

## Task shape (important)

Examples teach **token-level language IDs (EN/HI/OTHER)** and **token-level NER** over Roman-script **Hinglish**. That supports **language awareness** and **structured tagging**, **not** full “voice tutor” dialogue. For LinguaSwitch Stage 2 as described in `ARCHITECTURE.md`, plan to **add** consenting product dialogue traces or synthetic tutoring turns and merge or tune in a second job.

## Zip for Google Cloud

From this `Data` directory, a minimal upload is:

- `gluecos_vertex_cut/train.jsonl`
- `gluecos_vertex_cut/validation.jsonl`

Upload the zip to a GCS bucket, then point Vertex supervised tuning at those paths. See Google’s guide: [Prepare supervised fine-tuning data for Gemini models](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini-supervised-tuning-prepare).

## Rebuild

1. Put downloads in `source/` (or rerun fetches — see comments in `build_vertex_cut.py`).
2. `python build_vertex_cut.py`

## Size vs ~60 minutes

Roughly **1.1k train / 140 val** examples keeps token volume modest for a **short** supervised tuning job; adjust caps at the bottom of `build_vertex_cut.py` if Vertex estimates run long or short on your chosen model SKU.
