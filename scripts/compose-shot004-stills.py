#!/usr/bin/env python3
"""Compose 16:9 stills for 宣传片分镜 004 (three evidence-upgrade cards)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "video-assets" / "shot004"
ART = Path("/opt/cursor/artifacts") / "shot004"
VOID = ROOT / "exports" / "video-assets" / "shot003" / "source" / "shot003-bg-void.png"

W, H = 1920, 1080
CN = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"
LATIN = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
LATIN_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

WHITE = (232, 236, 240, 255)
MUTED = (168, 178, 188, 255)
TEAL = (126, 200, 200, 255)
DIM = (90, 102, 112, 255)
INK = (8, 12, 16, 255)


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


def load_bg():
    if VOID.exists():
        im = Image.open(VOID).convert("RGB")
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
    return Image.new("RGB", (W, H), (8, 12, 16))


def rounded_rect(size, fill, outline, width=2, radius=18):
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=fill, outline=outline, width=width)
    return im


def badge(draw, xy, text, fnt):
    x, y = xy
    pad_x, pad_y = 22, 10
    tw, th = text_size(draw, text, fnt)
    w, h = tw + pad_x * 2, th + pad_y * 2
    draw.rounded_rectangle((x, y, x + w, y + h), 8, outline=TEAL, width=2)
    draw.text((x + pad_x, y + pad_y - 2), text, font=fnt, fill=TEAL)
    return w, h


def landmark_card(bg, kicker, question, punch, detail, badge_text, source, filename):
    base = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 110))
    base = Image.alpha_composite(base, shade)
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_q = font(CN, 42)
    f_punch = font(CN, 64)
    f_detail = font(CN, 28)
    f_badge = font(CN, 24)
    f_src = font(LATIN, 26)
    f_foot = font(CN, 22)

    center_text(d, kicker, 88, f_kick, TEAL)
    d.rectangle((860, 130, 1060, 132), fill=TEAL)
    center_text(d, question, 168, f_q, WHITE)
    center_text(d, punch, 280, f_punch, TEAL)
    center_text(d, detail, 380, f_detail, MUTED)

    tw, _ = text_size(d, badge_text, f_badge)
    badge(d, ((W - (tw + 44)) // 2, 470), badge_text, f_badge)
    center_text(d, source, 560, f_src, WHITE)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 990, f_foot, MUTED)
    save(base, filename)


def three_up(bg, filename):
    base = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 100))
    base = Image.alpha_composite(base, shade)
    d = ImageDraw.Draw(base)
    f_kick = font(LATIN, 22)
    f_title = font(CN, 40)
    f_q = font(CN, 24)
    f_punch = font(CN, 32)
    f_badge = font(CN, 20)
    f_src = font(LATIN, 18)
    f_foot = font(CN, 22)

    center_text(d, "Floatation-REST", 64, f_kick, TEAL)
    center_text(d, "一次看见变化，重复做得完，对照也有了", 104, f_title, WHITE)

    cards = [
        ("01  一次", "一次，有没有变化？", "状态焦虑显著下降", "开放标签（非 RCT）", "PLoS ONE  2018"),
        ("02  重复", "重复，人能不能做完？", "六次做完  ·  无严重不良事件", "可行性随机对照", "PLoS ONE  2024"),
        ("03  对照", "对照，有没有更硬的证据？", "六个月后仍有信号", "随机对照  ·  柳叶子刊", "eClinicalMedicine  2023"),
    ]
    card_w, card_h = 540, 640
    gap = 36
    total = 3 * card_w + 2 * gap
    x0 = (W - total) // 2
    y0 = 200
    for i, (kick, q, punch, badge_t, src) in enumerate(cards):
        x = x0 + i * (card_w + gap)
        sh = Image.new("RGBA", (card_w + 20, card_h + 20), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sd.rounded_rectangle((8, 10, card_w + 8, card_h + 12), 18, fill=(0, 0, 0, 120))
        sh = sh.filter(ImageFilter.GaussianBlur(8))
        base.alpha_composite(sh, (x - 8, y0 - 6))
        card = rounded_rect((card_w, card_h), (12, 16, 20, 220), TEAL, 2, 18)
        base.alpha_composite(card, (x, y0))
        dd = ImageDraw.Draw(base)
        dd.text((x + 36, y0 + 36), kick[:2], font=f_src, fill=TEAL)
        tw, _ = text_size(dd, kick[:2] + "  ", f_src)
        dd.text((x + 36 + tw, y0 + 32), kick[4:], font=f_badge, fill=TEAL)
        dd.text((x + 36, y0 + 88), q, font=f_q, fill=WHITE)
        # punch may be long — draw as one or two lines
        dd.text((x + 36, y0 + 220), punch, font=f_punch, fill=TEAL)
        tw, _ = text_size(dd, badge_t, f_badge)
        bx = x + 36
        by = y0 + 430
        dd.rounded_rectangle((bx, by, bx + tw + 36, by + 42), 8, outline=TEAL, width=2)
        dd.text((bx + 18, by + 8), badge_t, font=f_badge, fill=TEAL)
        dd.text((x + 36, y0 + 520), src, font=f_src, fill=MUTED)

    d = ImageDraw.Draw(base)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 990, f_foot, MUTED)
    save(base, filename)


def main():
    bg = load_bg()
    landmark_card(
        bg,
        "01   ONCE",
        "一次，有没有变化？",
        "状态焦虑显著下降",
        "五十名焦虑 / 应激障碍患者  ·  单次约一小时",
        "开放标签（非 RCT）",
        "Laureate Institute   ·   PLoS ONE  2018",
        "004a-once.jpg",
    )
    landmark_card(
        bg,
        "02   REPEAT",
        "重复，人能不能做完？",
        "六次做完，没有严重不良事件",
        "七十五人  ·  约六次重复使用  ·  同一实验室",
        "可行性随机对照",
        "Laureate Institute   ·   PLoS ONE  2024",
        "004b-repeat.jpg",
    )
    landmark_card(
        bg,
        "03   CONTROLLED",
        "对照，有没有更硬的证据？",
        "六个月后仍有信号",
        "状态焦虑与身体意象  ·  柳叶子刊随机对照",
        "随机对照试验",
        "eClinicalMedicine   ·   The Lancet  2023",
        "004c-controlled.jpg",
    )
    three_up(bg, "004d-three-up.jpg")


if __name__ == "__main__":
    main()
