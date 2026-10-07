from PIL import Image, ImageDraw
from pathlib import Path

figma = Path("public/assets/home-digital/figma")
W, H = 86, 162
# Inner screen of the white Figma phone mock (86x162)
SCREEN = (7, 11, 79, 150)  # left, top, right, bottom


def cover_crop(img, sw, sh):
    img = img.convert("RGBA")
    tw, th = img.size
    scale = max(sw / tw, sh / th)
    nw, nh = max(1, int(tw * scale + 0.5)), max(1, int(th * scale + 0.5))
    img = img.resize((nw, nh), Image.LANCZOS)
    left = (nw - sw) // 2
    top = max(0, (nh - sh) // 2)
    return img.crop((left, top, left + sw, top + sh))


def make_phone(screen_src, out_path, donor_path):
    l, t, r, b = SCREEN
    sw, sh = r - l, b - t

    # Exact same white cadre as catalogue neighbours
    phone = Image.open(donor_path).convert("RGBA")
    px = phone.load()
    for y in range(t, b):
        for x in range(l, r):
            px[x, y] = (0, 0, 0, 0)

    screen = cover_crop(Image.open(screen_src), sw, sh)
    smask = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(smask).rounded_rectangle([0, 0, sw - 1, sh - 1], radius=5, fill=255)
    screen.putalpha(smask)
    phone.paste(screen, (l, t), screen)

    phone.save(out_path)
    print("wrote", out_path, phone.size)


donor = figma / "phone-dolce.png"
make_phone("src/assets/digital/club-capri/entrance.png", figma / "phone-capri.png", donor)
make_phone("src/assets/digital/sakura-koi/entrance.png", figma / "phone-sakura.png", donor)
