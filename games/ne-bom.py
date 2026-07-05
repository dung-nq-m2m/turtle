"""
Game: Né bom 💣
Học viện Turtle Python - Lớp 6

Phím ← → di chuyển, tránh bom rơi

Hình ảnh & âm thanh (tùy chọn):
  assets/ne-bom/images/nen-dem.gif
  assets/ne-bom/images/bom.gif
  assets/ne-bom/sounds/diem.wav, no.wav

Xem: assets/huong-dan-ne-bom.md
"""
import os
import random
import turtle

THU_MUC = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(THU_MUC, "assets", "ne-bom", "images")
SND = os.path.join(THU_MUC, "assets", "ne-bom", "sounds")
NGUONG_VA_CHAM = 25


def co_file(*phan):
    duong_dan = os.path.join(*phan)
    return duong_dan if os.path.isfile(duong_dan) else None


try:
    import winsound

    def phat_am(ten_file):
        path = co_file(SND, ten_file)
        if path:
            winsound.PlaySound(path, winsound.SND_ASYNC)
except ImportError:
    def phat_am(ten_file):
        pass


man_hinh = turtle.Screen()
man_hinh.title("Né bom 💣")
man_hinh.setup(width=600, height=500)
man_hinh.tracer(0)

nen = co_file(IMG, "nen-dem.gif")
if nen:
    man_hinh.bgpic(nen)
else:
    man_hinh.bgcolor("black")

BOM_GIF = co_file(IMG, "bom.gif")
if BOM_GIF:
    man_hinh.addshape(BOM_GIF)
    HINH_BOM = BOM_GIF
else:
    HINH_BOM = "bom_ve"
    man_hinh.register_shape(HINH_BOM, (
        (0, 14), (10, 8), (12, 0), (10, -10), (0, -14),
        (-10, -10), (-12, 0), (-10, 8),
    ))

nguoi = turtle.Turtle()
nguoi.shape("turtle")
nguoi.color("lime")
nguoi.penup()
nguoi.goto(0, -200)

bom = turtle.Turtle()
bom.shape(HINH_BOM)
if not BOM_GIF:
    bom.color("red")
bom.penup()
bom.hideturtle()

diem = 0
song = True
toc_do = 8

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("white" if nen else "white")
bang.goto(0, 220)


def ve_bang():
    bang.clear()
    bang.write(f"Điểm: {diem}  |  ← → di chuyển",
               align="center", font=("Arial", 14, "bold"))


def bom_moi():
    x = random.randint(-250, 250)
    bom.showturtle()
    bom.goto(x, 250)


def roi_bom():
    global diem, song, toc_do
    if not song:
        return
    bom.sety(bom.ycor() - toc_do)
    if bom.ycor() < -220:
        bom.hideturtle()
        diem += 1
        if diem % 5 == 0:
            toc_do += 2
        phat_am("diem.wav")
        ve_bang()
        man_hinh.ontimer(bom_moi, 300)
        return
    if (abs(bom.xcor() - nguoi.xcor()) < NGUONG_VA_CHAM
            and abs(bom.ycor() - nguoi.ycor()) < NGUONG_VA_CHAM):
        song = False
        phat_am("no.wav")
        bang.goto(0, 0)
        bang.write("GAME OVER!\nĐiểm: " + str(diem),
                   align="center", font=("Arial", 20, "bold"))
        return
    man_hinh.update()
    man_hinh.ontimer(roi_bom, 50)


def trai():
    if song:
        nguoi.setx(max(nguoi.xcor() - 30, -270))
        man_hinh.update()


def phai():
    if song:
        nguoi.setx(min(nguoi.xcor() + 30, 270))
        man_hinh.update()


man_hinh.listen()
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")

ve_bang()
bom_moi()
man_hinh.ontimer(roi_bom, 500)

turtle.done()
