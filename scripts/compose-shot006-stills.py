#!/usr/bin/env python3
"""Compose 16:9 stills for 宣传片分镜 006: 章末承接中式漂浮."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "video-assets" / "shot006"
ART = Path("/opt/cursor/artifacts") / "shot006"
VOID = ROOT / "exports" / "video-assets" / "shot003" / "source" / "shot003-bg-void.png"

W, H = 1920, 1080
CN = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"
LATIN = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
LATIN_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

WHITE = (232, 236, 240, 255)
MUTED = (168, 178, 188, 255)
TEAL = (126, 200, 200, 255)
DIM = (90, 102, 112, 255)
FOOT = "先有漂浮疗法，后有中式漂浮"


def font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except TypeError:
        return ImageFont.truetype(path, size)


def text_size(draw, text, fnt):
    b = draw.textbbox((0, 0), text, font=fnt)
    return b[2] - b[0], b[3] - b[1]


def center_text(draw, text, y, fnt, fill=WHITE):
    tw, _ = text_size(draw, text, fnt)
    draw.text(((W - tw) // 2, y), text, font=fnt, fill=fill)


def save(im: Image.Image, name: str):
    OUT.mkdir(parents=True, exist_ok=True)
    ART.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    rgb.save(OUT / name, "JPEG", quality=95, subsampling=0)
    rgb.save(ART / name, "JPEG", quality=95, subsampling=0)
    print(OUT / name, rgb.size)


def load_void():
    if VOID.exists():
        im = Image.open(VOID).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
        return im
    return Image.new("RGB", (W, H), (8, 12, 16))


def base_frame():
    bg = load_void().convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 100))
    return Image.alpha_composite(bg, shade)


def panel(draw_img, box, fill=(6, 10, 14, 236), outline=TEAL, width=2, radius=20):
    x0, y0, x1, y1 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x0 + 8, y0 + 12, x1 + 8, y1 + 12), radius, fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    out = Image.alpha_composite(draw_img, shadow)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((x0, y0, x1, y1), radius, fill=fill, outline=outline, width=width)
    return Image.alpha_composite(out, layer)


def foot_chip(d, f_foot):
    tw, _ = text_size(d, FOOT, f_foot)
    fx, fy = (W - tw) // 2, 1010
    d.rounded_rectangle((fx - 22, fy - 8, fx + tw + 22, fy + 36), 8, fill=(6, 10, 14, 220))
    d.text((fx, fy), FOOT, font=f_foot, fill=(210, 218, 224, 255))


def still_watch():
    base = base_frame()
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_title = font(CN, 42)
    f_big = font(CN, 72)
    f_sub = font(CN, 28)
    f_cap = font(CN, 26)
    f_foot = font(CN, 22)
    center_text(d, "Floatation-REST", 56, f_kick, TEAL)
    center_text(d, "国际目光，看向这两件事", 96, f_title, WHITE)

    cards = [("疼痛", "缓解疼痛"), ("睡眠", "促进睡眠")]
    cw, ch, gap = 520, 420, 56
    x0 = (W - (2 * cw + gap)) // 2
    y0 = 200
    for i, (title, sub) in enumerate(cards):
        x = x0 + i * (cw + gap)
        base = panel(base, (x, y0, x + cw, y0 + ch))
        dd = ImageDraw.Draw(base)
        tw, _ = text_size(dd, title, f_big)
        dd.text((x + (cw - tw) // 2, y0 + 130), title, font=f_big, fill=WHITE)
        sw, _ = text_size(dd, sub, f_sub)
        dd.text((x + (cw - sw) // 2, y0 + 250), sub, font=f_sub, fill=TEAL)

    d = ImageDraw.Draw(base)
    center_text(d, "国际研究十分关注漂浮在这两个领域的应用", 860, f_cap, MUTED)
    foot_chip(d, f_foot)
    save(base, "006a-watch.jpg")


def still_gap():
    base = base_frame()
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_title = font(CN, 42)
    f_row = font(CN, 36)
    f_tag = font(CN, 26)
    f_foot = font(CN, 22)
    center_text(d, "Floatation-REST", 56, f_kick, TEAL)
    center_text(d, "现有国际设备，还停在放松体验", 96, f_title, WHITE)

    rows = [
        ("放松体验", "已经常见", True),
        ("快速缓解疼痛", "还没兑现", False),
        ("有效促进睡眠", "还没兑现", False),
    ]
    x0, y0, rw, rh, gap = 260, 220, 1400, 180, 28
    for i, (left, right, done) in enumerate(rows):
        y = y0 + i * (rh + gap)
        outline = TEAL if done else (90, 120, 128, 200)
        fill = (6, 18, 20, 236) if done else (8, 10, 14, 236)
        base = panel(base, (x0, y, x0 + rw, y + rh), fill=fill, outline=outline)
        dd = ImageDraw.Draw(base)
        dd.text((x0 + 56, y + 58), left, font=f_row, fill=WHITE if done else (210, 218, 224, 255))
        tw, _ = text_size(dd, right, f_tag)
        bx = x0 + rw - tw - 88
        by = y + 58
        pill_fill = (16, 48, 48, 255) if done else (22, 24, 28, 255)
        pill_ink = TEAL if done else MUTED
        dd.rounded_rectangle((bx - 24, by - 8, bx + tw + 24, by + 52), 10, fill=pill_fill, outline=pill_ink, width=2)
        dd.text((bx, by + 4), right, font=f_tag, fill=pill_ink)

    d = ImageDraw.Draw(base)
    foot_chip(d, f_foot)
    save(base, "006b-gap.jpg")


def still_chinese():
    base = base_frame()
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_title = font(CN, 64)
    f_step = font(CN, 30)
    f_big = font(CN, 44)
    f_sub = font(CN, 26)
    f_foot = font(CN, 22)
    center_text(d, "Floatation-REST", 48, f_kick, TEAL)
    center_text(d, "中式漂浮", 88, f_title, WHITE)

    steps = ["扩大内涵", "结合机理", "技术升级"]
    sw, sh, gap = 380, 120, 36
    total = 3 * sw + 2 * gap
    sx = (W - total) // 2
    sy = 230
    for i, label in enumerate(steps):
        x = sx + i * (sw + gap)
        base = panel(base, (x, sy, x + sw, sy + sh), radius=16)
        dd = ImageDraw.Draw(base)
        tw, _ = text_size(dd, label, f_step)
        dd.text((x + (sw - tw) // 2, sy + 38), label, font=f_step, fill=WHITE)
        if i < 2:
            dd = ImageDraw.Draw(base)
            dd.text((x + sw + 6, sy + 36), "→", font=f_step, fill=TEAL)

    results = [("疼痛缓解", "让缓痛可兑现"), ("睡眠改善", "让助眠可兑现")]
    rw, rh, rgap = 620, 220, 48
    rx0 = (W - (2 * rw + rgap)) // 2
    ry = 420
    for i, (title, sub) in enumerate(results):
        x = rx0 + i * (rw + rgap)
        base = panel(base, (x, ry, x + rw, ry + rh))
        dd = ImageDraw.Draw(base)
        tw, _ = text_size(dd, title, f_big)
        dd.text((x + (rw - tw) // 2, ry + 58), title, font=f_big, fill=TEAL)
        sw2, _ = text_size(dd, sub, f_sub)
        dd.text((x + (rw - sw2) // 2, ry + 130), sub, font=f_sub, fill=WHITE)

    d = ImageDraw.Draw(base)
    bar = "中国漂浮行业专家教授  ×  漂浮方舟"
    sub = "正在收集整理相关研究数据"
    center_text(d, bar, 780, f_sub, WHITE)
    center_text(d, sub, 830, f_step, TEAL)
    foot_chip(d, f_foot)
    save(base, "006c-chinese.jpg")


def main():
    still_watch()
    still_gap()
    still_chinese()


if __name__ == "__main__":
    main()
