#!/usr/bin/env python3
"""Burn 003e still captions onto the EEG research clip.

Source video already contains BR / BREATHING RATE / BRAIN ACTIVITY / γβθα.
This only adds the Chinese captions from 003e-eeg-frame.jpg.

Run: python3 scripts/overlay-shot003-eeg-video.py
"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "video-assets" / "shot003"
ART = Path("/opt/cursor/artifacts") / "shot003"
USER = OUT / "user-source"
SRC_NAME = "eeg-research.mp4"
OVERLAY_PNG = OUT / "003e-eeg-overlay.png"
OUT_MP4 = OUT / "003e-eeg-overlay.mp4"

UPLOAD_CANDIDATES = [
    Path("/home/ubuntu/.cursor/projects/workspace/uploads/________-1_2026-08-01_16-49-41_1f07.mp4"),
]


def import_compose():
    import importlib.util

    path = ROOT / "scripts" / "compose-shot003-stills.py"
    spec = importlib.util.spec_from_file_location("compose_shot003_stills", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def find_source() -> Path:
    local = USER / SRC_NAME
    if local.exists() and local.stat().st_size > 1000:
        return local
    for p in UPLOAD_CANDIDATES:
        if p.exists():
            USER.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, local)
            print("copied source ->", local)
            return local
    raise FileNotFoundError(f"missing {local}")


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True)


def extract_frame(video: Path, t: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            t,
            "-i",
            str(video),
            "-frames:v",
            "1",
            "-update",
            "1",
            str(dest),
        ]
    )


def main() -> int:
    compose = import_compose()
    compose.OUT.mkdir(parents=True, exist_ok=True)
    compose.ART.mkdir(parents=True, exist_ok=True)
    overlay = compose.eeg_caption_overlay()
    overlay.save(OVERLAY_PNG)
    overlay.save(ART / "003e-eeg-overlay.png")

    src = find_source()
    ART.mkdir(parents=True, exist_ok=True)
    art_mp4 = ART / "003e-eeg-overlay.mp4"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-i",
            str(OVERLAY_PNG),
            "-filter_complex",
            "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p",
            "-c:v",
            "libx264",
            "-crf",
            "18",
            "-preset",
            "medium",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(OUT_MP4),
        ]
    )
    shutil.copy2(OUT_MP4, art_mp4)
    print(OUT_MP4, OUT_MP4.stat().st_size)

    for t, name in (("0", "003e-video-t0.jpg"), ("2.5", "003e-video-t25.jpg"), ("5.2", "003e-video-t52.jpg")):
        extract_frame(OUT_MP4, t, OUT / name)
        shutil.copy2(OUT / name, ART / name)
        im = Image.open(OUT / name)
        print(name, im.size)

    return 0


if __name__ == "__main__":
    sys.exit(main())
