#!/usr/bin/env python3
"""Generate the abstract cover / divider artwork for the deck (subtle, dark)."""
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

INK = (10, 10, 11)
OUT = os.environ.get("DECK_ART", "/tmp/deck/assets")


def base(w, h, blobs, vignette=0.30):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    img = np.zeros((h, w, 3), np.float32) + np.array(INK, np.float32)
    for cx, cy, sx, sy, col, amp in blobs:
        g = np.exp(-2.0 * (((xx - cx * w) / (sx * w)) ** 2 + ((yy - cy * h) / (sy * h)) ** 2))
        img += g[..., None] * np.array(col, np.float32) * amp
    dx = (xx - w / 2) / (w / 2)
    dy = (yy - h / 2) / (h / 2)
    v = 1.0 - vignette * np.clip((dx * dx + dy * dy) * 0.6, 0, 1)
    img *= v[..., None]
    return np.clip(img, 0, 255)


def network(img, seed, n, cx, spread, maxlink, alpha=1.0):
    h, w, _ = img.shape
    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    rng = random.Random(seed)
    pts = []
    for _ in range(n):
        x = rng.gauss(cx, spread) * w
        y = rng.uniform(0.02, 0.98) * h
        if 0 < x < w:
            pts.append((x, y))
    lw = max(1, int(w / 1600))
    for i, (x, y) in enumerate(pts):
        near = sorted(((math.hypot(x - qx, y - qy), j) for j, (qx, qy) in enumerate(pts) if j != i))[:3]
        for dist, j in near:
            if dist < maxlink * w:
                a = int((14 + rng.randint(0, 22)) * alpha)
                d.line([(x, y), pts[j]], fill=(255, 255, 255, a), width=lw)
    for (x, y) in pts:
        r = rng.uniform(w / 1800, w / 700)
        a = int((70 + rng.randint(0, 110)) * alpha)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, a))
    ov = ov.filter(ImageFilter.GaussianBlur(w / 5000))
    out = Image.alpha_composite(Image.fromarray(img.astype(np.uint8), "RGB").convert("RGBA"), ov)
    return out.convert("RGB")


def save(img, name):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    img.save(path, optimize=True)
    print("wrote", path, img.size)


def cover():
    w, h = 2800, 1575
    img = base(
        w,
        h,
        [
            (0.62, 0.42, 0.34, 0.30, (0, 214, 158), 0.16),
            (0.86, 0.78, 0.26, 0.30, (96, 84, 220), 0.10),
            (0.40, 0.85, 0.30, 0.22, (255, 255, 255), 0.035),
        ],
        vignette=0.42,
    )
    img = network(img, seed=11, n=110, cx=0.70, spread=0.19, maxlink=0.22, alpha=1.0)
    save(img, "cover.png")


def divider():
    w, h = 2400, 1350
    img = base(
        w,
        h,
        [
            (0.78, 0.34, 0.30, 0.34, (0, 214, 158), 0.09),
            (0.68, 0.72, 0.30, 0.30, (96, 84, 220), 0.05),
        ],
        vignette=0.45,
    )
    img = network(img, seed=29, n=55, cx=0.78, spread=0.13, maxlink=0.16, alpha=0.55)
    save(img, "divider.png")


if __name__ == "__main__":
    cover()
    divider()
