#!/usr/bin/env python3
"""Combine PNG screenshots into a single PDF (one page per screen)."""
import sys
from pathlib import Path

from PIL import Image


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: tales-lesson-pdf-build.py <output.pdf> <img1.png> ...", file=sys.stderr)
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    image_paths = [Path(p) for p in sys.argv[2:] if Path(p).exists()]
    if not image_paths:
        print("No images found.", file=sys.stderr)
        sys.exit(1)

    pages = []
    for path in image_paths:
        img = Image.open(path).convert("RGB")
        pages.append(img)

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    pages[0].save(
        pdf_path,
        save_all=True,
        append_images=pages[1:],
        resolution=144.0,
    )
    print(f"Wrote {pdf_path} ({len(pages)} pages)")


if __name__ == "__main__":
    main()
