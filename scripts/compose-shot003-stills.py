#!/usr/bin/env python3
"""Compose 16:9 stills for 宣传片分镜 003 (chapter card + timeline)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports" / "video-assets" / "shot003"
ART = Path("/opt/cursor/artifacts") / "shot003"
SRC_CANDIDATES = [
    OUT / "source",
    Path("/opt/cursor/artifacts/assets"),
]


def find_src(name: str) -> Path:
    for folder in SRC_CANDIDATES:
        p = folder / name
        if p.exists():
            return p
    raise FileNotFoundError(name)


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


def rounded(im: Image.Image, size, radius=18):
    im = im.copy().resize(size, Image.Resampling.LANCZOS)
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(im.convert("RGBA"), (0, 0))
    out.putalpha(mask)
    return out


def glow_dot(draw, xy, r, on=True):
    x, y = xy
    if on:
        for i, a in ((r + 18, 28), (r + 10, 55), (r + 4, 90)):
            draw.ellipse((x - i, y - i, x + i, y + i), fill=(126, 200, 200, a))
        draw.ellipse((x - r, y - r, x + r, y + r), fill=TEAL)
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=WHITE)
    else:
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(70, 82, 92, 180))
        draw.ellipse((x - 3, y - 3, x + 3, y + 3), fill=(140, 150, 158, 200))


def text_size(draw, text, fnt):
    b = draw.textbbox((0, 0), text, font=fnt)
    return b[2] - b[0], b[3] - b[1]


def center_text(draw, text, y, fnt, fill=WHITE, letter=0):
    if letter:
        w = sum(text_size(draw, ch, fnt)[0] + letter for ch in text) - letter
        x = (W - w) // 2
        for ch in text:
            draw.text((x, y), ch, font=fnt, fill=fill)
            x += text_size(draw, ch, fnt)[0] + letter
        return
    tw, _ = text_size(draw, text, fnt)
    draw.text(((W - tw) // 2, y), text, font=fnt, fill=fill)


def save(im: Image.Image, name: str):
    OUT.mkdir(parents=True, exist_ok=True)
    ART.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    rgb = im.convert("RGB")
    rgb.save(path, "JPEG", quality=95, subsampling=0)
    rgb.save(ART / name, "JPEG", quality=95, subsampling=0)
    print(path, rgb.size)


def chapter_card(bg: Image.Image):
    base = bg.convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 70))
    base = Image.alpha_composite(base, overlay)
    d = ImageDraw.Draw(base)
    f_en = font(LATIN, 28)
    f_title = font(CN, 72)
    f_sub = font(LATIN_B, 36)
    f_foot = font(CN, 28)
    center_text(d, "CHAPTER  01", 340, f_en, MUTED, letter=10)
    center_text(d, "Floatation-REST", 400, f_sub, TEAL, letter=4)
    center_text(d, "国际研究谱系", 470, f_title, WHITE)
    # divider
    d.rectangle((860, 575, 1060, 577), fill=TEAL)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 610, f_foot, MUTED)
    save(base, "003a-chapter-card.jpg")


def timeline(bg: Image.Image, thumbs, lit: int, name: str):
    base = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 90))
    base = Image.alpha_composite(base, shade)
    d = ImageDraw.Draw(base)

    f_kicker = font(LATIN, 22)
    f_title = font(CN, 40)
    f_year = font(LATIN_B, 22)
    f_label = font(CN, 26)
    f_foot = font(CN, 24)

    center_text(d, "Floatation-REST", 72, f_kicker, TEAL, letter=3)
    center_text(d, "国际研究谱系", 108, f_title, WHITE)

    card_w, card_h = 460, 278
    gap = 48
    total = 3 * card_w + 2 * gap
    x0 = (W - total) // 2
    y_card = 220
    nodes = []
    labels = [
        ("1950s", "隔离舱实验"),
        ("1970–80s", "被定名为 REST"),
        ("2010s–", "临床与影像研究"),
    ]
    for i, (thumb, (year, label)) in enumerate(zip(thumbs, labels)):
        x = x0 + i * (card_w + gap)
        on = i < lit
        photo = rounded(thumb, (card_w, card_h), 16)
        if not on:
            photo = ImageEnhanceDummy(photo, 0.38)
        # card shadow
        sh = Image.new("RGBA", (card_w + 16, card_h + 16), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sd.rounded_rectangle((8, 10, card_w + 8, card_h + 12), 16, fill=(0, 0, 0, 110))
        sh = sh.filter(ImageFilter.GaussianBlur(8))
        base.alpha_composite(sh, (x - 8, y_card - 6))
        # frame
        frame = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
        fd = ImageDraw.Draw(frame)
        fd.rounded_rectangle((0, 0, card_w - 1, card_h - 1), 16, outline=TEAL if on else DIM, width=2)
        base.alpha_composite(photo, (x, y_card))
        base.alpha_composite(frame, (x, y_card))
        # captions under card
        d = ImageDraw.Draw(base)
        fill_y = TEAL if on else DIM
        fill_l = WHITE if on else DIM
        tw, _ = text_size(d, year, f_year)
        d.text((x + (card_w - tw) // 2, y_card + card_h + 22), year, font=f_year, fill=fill_y)
        tw, _ = text_size(d, label, f_label)
        d.text((x + (card_w - tw) // 2, y_card + card_h + 54), label, font=f_label, fill=fill_l)
        nodes.append((x + card_w // 2, 920))

    d = ImageDraw.Draw(base)
    d.line((nodes[0][0], 920, nodes[-1][0], 920), fill=(90, 110, 120, 180), width=2)
    for i, (nx, ny) in enumerate(nodes):
        glow_dot(d, (nx, ny), 9, on=i < lit)

    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 990, f_foot, MUTED)
    save(base, name)


class ImageEnhanceDummy:
    """Darken an RGBA image without importing ImageEnhance for a one-liner."""

    def __new__(cls, im, factor):
        overlay = Image.new("RGBA", im.size, (0, 0, 0, int(255 * (1 - factor))))
        return Image.alpha_composite(im.convert("RGBA"), overlay)


def rounded_rect_card(size, fill, outline, width=1, radius=14):
    im = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=fill, outline=outline, width=width)
    return im


def naming_event_still(bg: Image.Image):
    """Historically checkable still: 1980 monograph + 1983 conference. Not a fake archive photo."""
    base = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 110))
    base = Image.alpha_composite(base, shade)
    d = ImageDraw.Draw(base)
    f_kicker = font(LATIN, 22)
    f_title = font(CN, 44)
    f_year = font(LATIN_B, 22)
    f_en = font(LATIN, 22)
    f_en_b = font(LATIN_B, 24)
    f_cn = font(CN, 26)
    f_small = font(CN, 22)
    f_foot = font(CN, 24)

    center_text(d, "1970–80s", 70, f_kicker, TEAL, letter=4)
    center_text(d, "被定名为 REST", 108, f_title, WHITE)
    center_text(d, "不是一场开会起名的仪式，是专著和会议把这个名字立住", 172, f_small, MUTED)

    card_w, card_h = 760, 520
    gap = 48
    y0 = 230
    x1 = (W - (2 * card_w + gap)) // 2
    x2 = x1 + card_w + gap

    def draw_doc(x, badge, badge_cn, lines):
        card = rounded_rect_card((card_w, card_h), (12, 16, 20, 210), TEAL, 2, 16)
        base.alpha_composite(card, (x, y0))
        dd = ImageDraw.Draw(base)
        dd.rectangle((x + 36, y0 + 36, x + 36 + 8, y0 + 36 + 28), fill=TEAL)
        dd.text((x + 56, y0 + 36), badge, font=f_year, fill=TEAL)
        dd.text((x + 56, y0 + 68), badge_cn, font=f_cn, fill=WHITE)
        yy = y0 + 130
        for kind, text in lines:
            fnt = f_en_b if kind == "b" else (f_cn if kind == "cn" else f_en)
            fill = WHITE if kind in ("b", "cn") else MUTED
            dd.text((x + 56, yy), text, font=fnt, fill=fill)
            yy += 42 if kind == "b" else 36

    draw_doc(
        x1,
        "1980  ·  MONOGRAPH",
        "专著把名字写进书名",
        [
            ("b", "Peter Suedfeld"),
            ("en", "Restricted Environmental Stimulation:"),
            ("en", "Research and Clinical Applications"),
            ("en", "Wiley, New York, 1980"),
            ("cn", "REST 从此成为可引用的方法名"),
        ],
    )
    draw_doc(
        x2,
        "1983  ·  CONFERENCE",
        "国际会议开始用这个名字开会",
        [
            ("b", "1st International Conference on"),
            ("en", "REST and Self-Regulation"),
            ("en", "Fine, T.H. & Turner, J.W. (Eds.)"),
            ("en", "Proceedings, Toledo, 1983"),
            ("cn", "漂浮 REST 的早期生理研究在此发表"),
        ],
    )

    d = ImageDraw.Draw(base)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 990, f_foot, MUTED)
    save(base, "003d-naming-events.jpg")
    return crop_16x9(Image.open(OUT / "003d-naming-events.jpg"))


def clinical_imaging_still(bg: Image.Image):
    """2018 open-label clinical paper + 2021 first fMRI. Not a fake lab photo."""
    base = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 110))
    base = Image.alpha_composite(base, shade)
    d = ImageDraw.Draw(base)
    f_kicker = font(LATIN, 22)
    f_title = font(CN, 44)
    f_year = font(LATIN_B, 22)
    f_en = font(LATIN, 22)
    f_en_b = font(LATIN_B, 22)
    f_cn = font(CN, 26)
    f_small = font(CN, 22)
    f_foot = font(CN, 24)

    center_text(d, "2010s–", 70, f_kicker, TEAL, letter=4)
    center_text(d, "临床与影像研究", 108, f_title, WHITE)
    center_text(d, "不是气氛实验室，是可核验的两篇论文：一次临床观察，一次首次 fMRI", 172, f_small, MUTED)

    card_w, card_h = 760, 520
    gap = 48
    y0 = 230
    x1 = (W - (2 * card_w + gap)) // 2
    x2 = x1 + card_w + gap

    def draw_doc(x, badge, badge_cn, lines):
        card = rounded_rect_card((card_w, card_h), (12, 16, 20, 210), TEAL, 2, 16)
        base.alpha_composite(card, (x, y0))
        dd = ImageDraw.Draw(base)
        dd.rectangle((x + 36, y0 + 36, x + 36 + 8, y0 + 36 + 28), fill=TEAL)
        dd.text((x + 56, y0 + 36), badge, font=f_year, fill=TEAL)
        dd.text((x + 56, y0 + 68), badge_cn, font=f_cn, fill=WHITE)
        yy = y0 + 128
        for kind, text in lines:
            fnt = f_en_b if kind == "b" else (f_cn if kind == "cn" else f_en)
            fill = WHITE if kind in ("b", "cn") else MUTED
            dd.text((x + 56, yy), text, font=fnt, fill=fill)
            yy += 40 if kind == "b" else 34

    draw_doc(
        x1,
        "2018  ·  CLINICAL",
        "开放标签临床观察（不是 RCT）",
        [
            ("b", "Feinstein, Khalsa, Yeh et al."),
            ("en", "Examining the short-term anxiolytic"),
            ("en", "and antidepressant effect of"),
            ("en", "Floatation-REST"),
            ("en", "PLoS ONE  2018  ·  NCT03051074"),
            ("cn", "Laureate 研究所 · 50 人 · 状态焦虑下降"),
        ],
    )
    draw_doc(
        x2,
        "2021  ·  fMRI",
        "首次漂浮功能影像研究",
        [
            ("b", "Al Zoubi, Misaki, Bodurka,"),
            ("en", "Feinstein et al."),
            ("en", "Taking the body off the mind"),
            ("en", "Human Brain Mapping  2021"),
            ("en", "DOI 10.1002/hbm.25429"),
            ("cn", "漂浮前后静息态 fMRI · DMN 连接变化"),
        ],
    )

    d = ImageDraw.Draw(base)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 990, f_foot, MUTED)
    save(base, "003e-clinical-imaging.jpg")
    return crop_16x9(Image.open(OUT / "003e-clinical-imaging.jpg"))


def compact_event_still(bg, kicker, title, left, right, filename):
    """Readable timeline thumb: two big year blocks, not a squeezed document page."""
    base = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 100))
    base = Image.alpha_composite(base, shade)
    d = ImageDraw.Draw(base)
    f_kicker = font(LATIN, 22)
    f_title = font(CN, 48)
    f_year = font(LATIN_B, 56)
    f_cn = font(CN, 32)
    f_en = font(LATIN, 24)
    center_text(d, kicker, 80, f_kicker, TEAL, letter=4)
    center_text(d, title, 124, f_title, WHITE)
    card_w, card_h = 700, 420
    gap = 56
    y0 = 280
    x1 = (W - (2 * card_w + gap)) // 2
    x2 = x1 + card_w + gap
    f_foot = font(CN, 24)

    def block(x, year, cn, en):
        card = rounded_rect_card((card_w, card_h), (12, 16, 20, 210), TEAL, 2, 16)
        base.alpha_composite(card, (x, y0))
        dd = ImageDraw.Draw(base)
        tw, _ = text_size(dd, year, f_year)
        dd.text((x + (card_w - tw) // 2, y0 + 90), year, font=f_year, fill=TEAL)
        tw, _ = text_size(dd, cn, f_cn)
        dd.text((x + (card_w - tw) // 2, y0 + 190), cn, font=f_cn, fill=WHITE)
        tw, _ = text_size(dd, en, f_en)
        dd.text((x + (card_w - tw) // 2, y0 + 250), en, font=f_en, fill=MUTED)

    block(x1, *left)
    block(x2, *right)
    d = ImageDraw.Draw(base)
    center_text(d, "限制性环境刺激疗法  ·  先有方法，后有舱", 990, f_foot, MUTED)
    save(base, filename)
    return crop_16x9(Image.open(OUT / filename))


def full_node(photo: Image.Image, year: str, label: str, name: str):
    base = crop_16x9(photo).convert("RGBA")
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    for y in range(720, H):
        a = int(210 * ((y - 720) / (H - 720)) ** 1.15)
        gd.line((0, y, W, y), fill=(0, 0, 0, min(a, 210)))
    base = Image.alpha_composite(base, grad)
    d = ImageDraw.Draw(base)
    f_year = font(LATIN_B, 28)
    f_label = font(CN, 48)
    f_foot = font(CN, 24)
    d.text((96, 860), year, font=f_year, fill=TEAL)
    d.text((96, 900), label, font=f_label, fill=WHITE)
    tw, _ = text_size(d, "限制性环境刺激疗法  ·  先有方法，后有舱", f_foot)
    d.text((W - 96 - tw, 990), "限制性环境刺激疗法  ·  先有方法，后有舱", font=f_foot, fill=MUTED)
    save(base, name)


def main():
    source_dir = OUT / "source"
    source_dir.mkdir(parents=True, exist_ok=True)
    names = [
        "shot003-bg-void.png",
        "shot003-node-1950s-tank.png",
        "shot003-node-1970s-rest.png",
        "shot003-node-2010s-clinical.png",
        "shot003-timeline-plate.png",
    ]
    for name in names:
        src = find_src(name)
        dst = source_dir / name
        if src.resolve() != dst.resolve():
            dst.write_bytes(src.read_bytes())

    void = crop_16x9(Image.open(source_dir / "shot003-bg-void.png"))
    t1950 = crop_16x9(Image.open(source_dir / "shot003-node-1950s-tank.png"))
    t1970 = crop_16x9(Image.open(source_dir / "shot003-node-1970s-rest.png"))
    t2010 = crop_16x9(Image.open(source_dir / "shot003-node-2010s-clinical.png"))
    thumbs = [t1950, t1970, t2010]

    plate_dir = OUT / "plates"
    plate_dir.mkdir(parents=True, exist_ok=True)
    for src_name, dst in [
        ("shot003-bg-void.png", "plate-bg-void.jpg"),
        ("shot003-node-1950s-tank.png", "plate-1950s.jpg"),
        ("shot003-node-1970s-rest.png", "plate-1970s.jpg"),
        ("shot003-node-2010s-clinical.png", "plate-2010s.jpg"),
        ("shot003-timeline-plate.png", "plate-timeline-raw.jpg"),
    ]:
        crop_16x9(Image.open(source_dir / src_name)).save(plate_dir / dst, "JPEG", quality=92)

    chapter_card(void)
    naming = naming_event_still(void)
    clinical = clinical_imaging_still(void)
    naming_thumb = compact_event_still(
        void,
        "1970–80s",
        "被定名为 REST",
        ("1980", "Suedfeld 专著", "Wiley"),
        ("1983", "REST 国际会议", "Fine & Turner"),
        "003d-naming-compact.jpg",
    )
    clinical_thumb = compact_event_still(
        void,
        "2010s–",
        "临床与影像研究",
        ("2018", "PLoS ONE 临床", "Feinstein / open-label"),
        ("2021", "首次 fMRI", "Human Brain Mapping"),
        "003e-imaging-compact.jpg",
    )
    thumbs = [t1950, naming_thumb, clinical_thumb]
    timeline(void, thumbs, 1, "003b-timeline-01.jpg")
    timeline(void, thumbs, 2, "003b-timeline-02.jpg")
    timeline(void, thumbs, 3, "003b-timeline-03.jpg")
    full_node(t1950, "1950s", "隔离舱实验", "003c-1950s.jpg")
    full_node(t1970, "1970–80s", "被定名为 REST", "003d-1970s-broll.jpg")
    full_node(t2010, "2010s–", "临床与影像研究", "003e-2010s-broll.jpg")
    _ = naming, clinical


if __name__ == "__main__":
    main()
