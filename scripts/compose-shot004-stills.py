#!/usr/bin/env python3
"""Compose 16:9 stills for 宣传片分镜 004: four papers, title-page crops."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "video-assets" / "shot004"
ART = Path("/opt/cursor/artifacts") / "shot004"
USER = OUT / "user-source"
VOID = ROOT / "exports" / "video-assets" / "shot003" / "source" / "shot003-bg-void.png"

W, H = 1920, 1080
CN = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"
LATIN = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
LATIN_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

WHITE = (232, 236, 240, 255)
MUTED = (168, 178, 188, 255)
TEAL = (126, 200, 200, 255)
DIM = (90, 102, 112, 255)


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
        im = Image.open(VOID).convert("RGB")
        return crop_16x9(im)
    return Image.new("RGB", (W, H), (8, 12, 16))


def crop_16x9(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size
    target = 16 / 9
    if w / h > target:
        nw = int(h * target)
        x0 = (w - nw) // 2
        im = im.crop((x0, 0, x0 + nw, h))
    else:
        nh = int(w / target)
        y0 = (h - nh) // 2
        im = im.crop((0, y0, w, y0 + nh))
    return im.resize((W, H), Image.Resampling.LANCZOS)


def title_band(path: Path) -> Image.Image:
    """Keep journal masthead + article title; do not show PDF body figures."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    band = im.crop((0, 0, w, int(h * 0.46)))
    return crop_16x9(band)


def rounded(im: Image.Image, size, radius=14):
    im = im.copy().resize(size, Image.Resampling.LANCZOS)
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(im.convert("RGBA"), (0, 0))
    out.putalpha(mask)
    return out


def paper_card(photo: Image.Image, kicker, question, punch, detail, badge_text, filename):
    base = photo.convert("RGBA")
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    for y in range(520, H):
        a = int(235 * ((y - 520) / (H - 520)) ** 0.85)
        gd.line((0, y, W, y), fill=(0, 0, 0, min(a, 235)))
    base = Image.alpha_composite(base, grad)
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_q = font(CN, 36)
    f_punch = font(CN, 52)
    f_detail = font(CN, 24)
    f_badge = font(CN, 22)
    f_foot = font(CN, 20)
    d.text((96, 620), kicker, font=f_kick, fill=TEAL)
    d.text((96, 658), question, font=f_q, fill=WHITE)
    d.text((96, 718), punch, font=f_punch, fill=TEAL)
    d.text((96, 790), detail, font=f_detail, fill=MUTED)
    tw, th = text_size(d, badge_text, f_badge)
    bx, by = 96, 848
    d.rounded_rectangle((bx, by, bx + tw + 36, by + 44), 8, outline=TEAL, width=2)
    d.text((bx + 18, by + 8), badge_text, font=f_badge, fill=TEAL)
    tw, _ = text_size(d, "限制性环境刺激疗法  ·  先有方法，后有舱", f_foot)
    d.text((W - 96 - tw, 990), "限制性环境刺激疗法  ·  先有方法，后有舱", font=f_foot, fill=MUTED)
    save(base, filename)


def four_up(photos, filename):
    bg = load_void().convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 90))
    bg = Image.alpha_composite(bg, shade)
    d = ImageDraw.Draw(bg)
    f_kick = font(LATIN, 20)
    f_title = font(CN, 36)
    f_label = font(CN, 22)
    f_foot = font(CN, 20)
    center_text(d, "Floatation-REST", 48, f_kick, TEAL)
    center_text(d, "一次看见变化，重复做得完，对照有信号", 84, f_title, WHITE)

    labels = [
        "2018  一次 · 开放标签",
        "2024  重复 · 可行性对照",
        "2014  功效 · 随机对照试点",
        "2023  随访 · 柳叶子刊对照",
    ]
    tw, th = 860, 360
    gap_x, gap_y = 28, 56
    x0 = (W - (2 * tw + gap_x)) // 2
    y0 = 160
    for i, (photo, lab) in enumerate(zip(photos, labels)):
        col, row = i % 2, i // 2
        x = x0 + col * (tw + gap_x)
        y = y0 + row * (th + gap_y)
        sh = Image.new("RGBA", (tw + 16, th + 16), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sd.rounded_rectangle((6, 8, tw + 6, th + 10), 16, fill=(0, 0, 0, 120))
        sh = sh.filter(ImageFilter.GaussianBlur(6))
        bg.alpha_composite(sh, (x - 6, y - 4))
        thumb = rounded(photo, (tw, th), 14)
        bg.alpha_composite(thumb, (x, y))
        frame = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        fd = ImageDraw.Draw(frame)
        fd.rounded_rectangle((0, 0, tw - 1, th - 1), 14, outline=TEAL, width=2)
        bg.alpha_composite(frame, (x, y))
        dd = ImageDraw.Draw(bg)
        lw, _ = text_size(dd, lab, f_label)
        dd.text((x + (tw - lw) // 2, y + th + 10), lab, font=f_label, fill=WHITE)

    d = ImageDraw.Draw(bg)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 1020, f_foot, MUTED)
    save(bg, filename)


def main():
    p2018 = title_band(USER / "feinstein-2018-p1.jpg")
    p2024 = title_band(USER / "garland-2024-p1.jpg")
    p2014 = title_band(USER / "kjellgren-2014-p1.jpg")
    p2023 = title_band(USER / "choquette-2023-p1.jpg")

    paper_card(
        p2018,
        "01   PLoS ONE  2018",
        "一次，有没有变化？",
        "状态焦虑显著下降",
        "五十名焦虑 / 应激障碍患者  ·  单次约一小时  ·  Laureate",
        "开放标签（非 RCT）",
        "004a-once.jpg",
    )
    paper_card(
        p2024,
        "02   PLoS ONE  2024",
        "重复，人能不能做完？",
        "六次，人能做完",
        "七十五人  ·  同一实验室  ·  无严重不良事件",
        "可行性随机对照  ·  不是疗效金标准",
        "004b-repeat.jpg",
    )
    paper_card(
        p2014,
        "03   BMC  2014",
        "对照，有没有功效？",
        "压力与焦虑指标下降",
        "六十五人  ·  十二次  ·  等待名单对照  ·  预防性保健试点",
        "随机对照试点",
        "004c-efficacy.jpg",
    )
    paper_card(
        p2023,
        "04   eClinicalMedicine  2023",
        "更硬的对照，会不会很快没了？",
        "六个月后仍有信号",
        "状态焦虑与身体意象  ·  柳叶子刊随机对照",
        "随机对照试验",
        "004d-followup.jpg",
    )
    four_up([p2018, p2024, p2014, p2023], "004e-four-up.jpg")


if __name__ == "__main__":
    main()
