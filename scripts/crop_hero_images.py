from PIL import Image, ImageFilter
import os

out = r"c:\Lovely_Wedding_front_end-master\public\assets\home-digital\figma"
src = r"C:\Users\mkadm\.cursor\projects\c-Lovely-Wedding-front-end-master\assets\c__Users_mkadm_AppData_Roaming_Cursor_User_workspaceStorage_6c931364033ea424dbe6403390a7fe36_images_composer-annotation-bce5f4c9-282b-4679-bf12-df80617924ca.png"
im = Image.open(src).convert("RGB")


def soft_red_cleanup(img: Image.Image) -> Image.Image:
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r > 130 and r > g + 50 and r > b + 50:
                # sample left neighbor if available else cream
                if x > 2:
                    nr, ng, nb = px[x - 2, y]
                    if not (nr > 130 and nr > ng + 50):
                        px[x, y] = (nr, ng, nb)
                        continue
                px[x, y] = (245, 245, 245)
    return img


def export(name, box, scale=5):
    crop = soft_red_cleanup(im.crop(box))
    big = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(radius=1.2, percent=110, threshold=2))
    big.save(os.path.join(out, name), optimize=True)
    crop.save(os.path.join(out, f"_check_{name}"))
    print(name, box, "->", big.size)


# Phone frame only (no title / CTA)
export("hero-center.png", (265, 58, 352, 255))
# Bow card only — cut navy / annotation on the right
export("hero-side-right.png", (365, 58, 432, 278))

print("done")
