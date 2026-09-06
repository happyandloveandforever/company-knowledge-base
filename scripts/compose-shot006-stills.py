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
USER = OUT / "user-source"
VIDEO_FRAME = USER / "chinese-float-video-frame0.jpg"
BRANDS = [
    "i-sopod",
    "Dreampod",
    "Oasis",
    "Superior",
    "Ocean Float",
    "Samadhi",
]


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


def rounded(im: Image.Image, size, radius=16):
    im = im.copy().resize(size, Image.Resampling.LANCZOS)
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(im.convert("RGBA"), (0, 0))
    out.putalpha(mask)
    return out


def play_badge(size=110):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, size - 1, size - 1), fill=(6, 10, 14, 200), outline=TEAL, width=3)
    p = size
    tri = [(int(p * 0.40), int(p * 0.28)), (int(p * 0.40), int(p * 0.72)), (int(p * 0.74), int(p * 0.50))]
    d.polygon(tri, fill=TEAL)
    return im


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
    f_title = font(CN, 40)
    f_brand = font(LATIN_B, 26)
    f_cap = font(CN, 22)
    f_row = font(CN, 32)
    f_tag = font(CN, 24)
    f_foot = font(CN, 22)
    center_text(d, "Floatation-REST", 44, f_kick, TEAL)
    center_text(d, "现有国际设备，还停在放松体验", 82, f_title, WHITE)
    center_text(d, "国际常见商业舱（成片可换成各品牌正式标识）", 138, f_cap, MUTED)

    bw, bh, gap_x, gap_y = 280, 78, 24, 18
    cols = 3
    total_w = cols * bw + (cols - 1) * gap_x
    bx0 = (W - total_w) // 2
    by0 = 178
    for i, name in enumerate(BRANDS):
        col, row = i % cols, i // cols
        x = bx0 + col * (bw + gap_x)
        y = by0 + row * (bh + gap_y)
        base = panel(base, (x, y, x + bw, y + bh), fill=(10, 14, 18, 236), outline=(120, 170, 170, 180), radius=14)
        dd = ImageDraw.Draw(base)
        tw, _ = text_size(dd, name, f_brand)
        dd.text((x + (bw - tw) // 2, y + 22), name, font=f_brand, fill=WHITE)

    rows = [
        ("放松体验", "已经常见", True),
        ("快速缓解疼痛", "还没兑现", False),
        ("有效促进睡眠", "还没兑现", False),
    ]
    x0, y0, rw, rh, gap = 260, 390, 1400, 148, 18
    for i, (left, right, done) in enumerate(rows):
        y = y0 + i * (rh + gap)
        outline = TEAL if done else (90, 120, 128, 200)
        fill = (6, 18, 20, 236) if done else (8, 10, 14, 236)
        base = panel(base, (x0, y, x0 + rw, y + rh), fill=fill, outline=outline)
        dd = ImageDraw.Draw(base)
        dd.text((x0 + 48, y + 48), left, font=f_row, fill=WHITE if done else (210, 218, 224, 255))
        tw, _ = text_size(dd, right, f_tag)
        bx = x0 + rw - tw - 80
        by = y + 46
        pill_fill = (16, 48, 48, 255) if done else (22, 24, 28, 255)
        pill_ink = TEAL if done else MUTED
        dd.rounded_rectangle((bx - 20, by - 6, bx + tw + 20, by + 46), 10, fill=pill_fill, outline=pill_ink, width=2)
        dd.text((bx, by + 4), right, font=f_tag, fill=pill_ink)

    d = ImageDraw.Draw(base)
    foot_chip(d, f_foot)
    save(base, "006b-gap.jpg")


def still_chinese():
    base = base_frame()
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_title = font(CN, 52)
    f_step = font(CN, 24)
    f_chip = font(CN, 22)
    f_result = font(CN, 30)
    f_sub = font(CN, 24)
    f_foot = font(CN, 22)
    center_text(d, "Floatation-REST", 28, f_kick, TEAL)
    center_text(d, "中式漂浮", 58, f_title, WHITE)

    steps = ["扩大内涵", "结合机理", "技术升级"]
    sw, sh, gap = 280, 56, 22
    total = 3 * sw + 2 * gap
    sx = (W - total) // 2
    sy = 128
    for i, label in enumerate(steps):
        x = sx + i * (sw + gap)
        base = panel(base, (x, sy, x + sw, sy + sh), radius=12)
        dd = ImageDraw.Draw(base)
        tw, _ = text_size(dd, label, f_step)
        dd.text((x + (sw - tw) // 2, sy + 12), label, font=f_step, fill=WHITE)
        if i < 2:
            dd.text((x + sw + 2, sy + 10), "→", font=f_step, fill=TEAL)

    vw, vh = 1280, 720
    vx, vy = (W - vw) // 2, 204
    frame = Image.open(VIDEO_FRAME).convert("RGB")
    thumb = rounded(frame, (vw, vh), 18)
    shade = Image.new("RGBA", (vw, vh), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    sd.rounded_rectangle((8, 10, vw + 6, vh + 12), 18, fill=(0, 0, 0, 140))
    shade = shade.filter(ImageFilter.GaussianBlur(10))
    base.alpha_composite(shade, (vx - 4, vy - 4))
    base.alpha_composite(thumb, (vx, vy))
    border = Image.new("RGBA", (vw, vh), (0, 0, 0, 0))
    bd = ImageDraw.Draw(border)
    bd.rounded_rectangle((1, 1, vw - 2, vh - 2), 18, outline=TEAL, width=3)
    base.alpha_composite(border, (vx, vy))

    play = play_badge(108)
    base.alpha_composite(play, (vx + (vw - 108) // 2, vy + (vh - 108) // 2 - 24))

    tag = "视频位 · 成片换成这段画面"
    dd = ImageDraw.Draw(base)
    tw, _ = text_size(dd, tag, f_chip)
    tx, ty = vx + vw - tw - 36, vy + 18
    dd.rounded_rectangle((tx - 16, ty - 6, tx + tw + 16, ty + 34), 8, fill=(6, 10, 14, 230), outline=TEAL, width=2)
    dd.text((tx, ty), tag, font=f_chip, fill=WHITE)

    bar_h = 118
    bar = Image.new("RGBA", (vw, bar_h), (0, 0, 0, 0))
    br = ImageDraw.Draw(bar)
    br.rounded_rectangle((0, 0, vw - 1, bar_h - 1), 16, fill=(6, 10, 14, 230))
    left, right = "疼痛缓解", "睡眠改善"
    gap_txt = "  ·  "
    combo = left + gap_txt + right
    cw, _ = text_size(br, combo, f_result)
    cx = (vw - cw) // 2
    br.text((cx, 18), combo, font=f_result, fill=TEAL)
    note = "中国漂浮行业专家教授  ×  漂浮方舟　正在收集整理研究数据"
    nw, _ = text_size(br, note, f_sub)
    br.text(((vw - nw) // 2, 68), note, font=f_sub, fill=WHITE)
    base.alpha_composite(bar, (vx, vy + vh - bar_h - 8))

    d = ImageDraw.Draw(base)
    foot_chip(d, f_foot)
    save(base, "006c-chinese.jpg")


def main():
    still_watch()
    still_gap()
    still_chinese()


if __name__ == "__main__":
    main()
