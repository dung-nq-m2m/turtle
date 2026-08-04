"""Tạo sẵn GIF ô tô cho game Đua xe (chạy một lần)."""
from PIL import Image, ImageDraw
import os

OUT = os.path.dirname(os.path.abspath(__file__))


def make_car(body, accent, window, outline, path, w=40, h=60):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    d.rounded_rectangle([4, 6, w - 5, h - 7], radius=8, fill=body, outline=outline, width=2)
    d.rounded_rectangle([8, 12, w - 9, 28], radius=4, fill=window, outline=outline, width=1)
    d.rounded_rectangle([8, 40, w - 9, 50], radius=3, fill=window, outline=outline, width=1)
    d.line([(10, 32), (w - 11, 32)], fill=accent, width=2)

    d.ellipse([7, 7, 14, 13], fill=(255, 240, 150, 255), outline=outline)
    d.ellipse([w - 15, 7, w - 8, 13], fill=(255, 240, 150, 255), outline=outline)
    d.ellipse([7, h - 14, 14, h - 8], fill=(220, 40, 40, 255), outline=outline)
    d.ellipse([w - 15, h - 14, w - 8, h - 8], fill=(220, 40, 40, 255), outline=outline)

    wheel = (35, 35, 35, 255)
    d.rounded_rectangle([1, 14, 6, 26], radius=2, fill=wheel)
    d.rounded_rectangle([w - 7, 14, w - 2, 26], radius=2, fill=wheel)
    d.rounded_rectangle([1, 38, 6, 50], radius=2, fill=wheel)
    d.rounded_rectangle([w - 7, 38, w - 2, 50], radius=2, fill=wheel)
    d.rectangle([w // 2 - 2, 30, w // 2 + 1, 42], fill=accent)

    # Magenta key → GIF transparency (turtle đọc được)
    key = (255, 0, 255)
    bg = Image.new("RGB", (w, h), key)
    alpha = img.getchannel("A")
    bg.paste(img.convert("RGB"), mask=alpha.point(lambda a: 255 if a > 128 else 0))

    colors = {key: 0}
    idx = 1
    pixels = list(bg.getdata())
    for px in pixels:
        if px not in colors and idx < 256:
            colors[px] = idx
            idx += 1

    palette = []
    inv = {v: k for k, v in colors.items()}
    for i in range(256):
        palette.extend(inv.get(i, (0, 0, 0)))

    pal_img = Image.new("P", (w, h))
    pal_img.putpalette(palette)
    pal_img.putdata([colors[px] for px in pixels])
    pal_img.save(path, format="GIF", transparency=0)
    print("Saved", path)


make_car(
    (40, 110, 220, 255), (255, 220, 50, 255), (180, 220, 255, 255), (20, 50, 120, 255),
    os.path.join(OUT, "xe-em.gif"),
)
make_car(
    (220, 50, 50, 255), (255, 200, 40, 255), (200, 230, 255, 255), (120, 20, 20, 255),
    os.path.join(OUT, "xe-doi.gif"),
)
make_car(
    (240, 140, 30, 255), (255, 255, 100, 255), (200, 230, 255, 255), (140, 70, 10, 255),
    os.path.join(OUT, "xe-doi-cam.gif"),
)
make_car(
    (150, 60, 200, 255), (255, 220, 80, 255), (200, 230, 255, 255), (80, 30, 110, 255),
    os.path.join(OUT, "xe-doi-tim.gif"),
)
print("Done")
