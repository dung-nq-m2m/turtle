"""
Game: Bắn bóng ⚽
Học viện Turtle Python - Lớp 6

← → di chuyển súng, SPACE bắn trúng mục tiêu

Hình ảnh & âm thanh (tùy chọn) — cùng thư mục với file .py:
  nen-san.gif, sung.gif, muc-tieu.gif
  ban.wav, trung.wav, thang.wav

Xem: assets/huong-dan-ban-bong.md
"""
import os
import random
import turtle

THU_MUC = os.path.dirname(os.path.abspath(__file__))
NGUONG_TRUNG = 25


def co_file(ten_file):
    duong_dan = os.path.join(THU_MUC, ten_file)
    return duong_dan if os.path.isfile(duong_dan) else None


try:
    import winsound

    def phat_am(ten_file):
        path = co_file(ten_file)
        if path:
            winsound.PlaySound(path, winsound.SND_ASYNC)
except ImportError:
    def phat_am(ten_file):
        pass


man_hinh = turtle.Screen()
man_hinh.title("Bắn bóng ⚽")
man_hinh.setup(width=600, height=500)
man_hinh.tracer(0)

nen = co_file("nen-san.gif")
if nen:
    man_hinh.bgpic(nen)
else:
    man_hinh.bgcolor("navy")

SUNG_GIF = co_file("sung.gif")
MT_GIF = co_file("muc-tieu.gif")
if SUNG_GIF:
    man_hinh.addshape(SUNG_GIF)
if MT_GIF:
    man_hinh.addshape(MT_GIF)

sung = turtle.Turtle()
if SUNG_GIF:
    sung.shape(SUNG_GIF)
else:
    sung.shape("triangle")
    sung.color("yellow")
sung.penup()
sung.goto(0, -200)
sung.setheading(90)

dan = []
muc_tieu = []
diem = 0
thang = False

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("white")
bang.goto(0, 220)


def ve_bang():
    bang.clear()
    bang.goto(0, 220)
    bang.write(
        f"Điểm: {diem}  |  ← → Space",
        align="center",
        font=("Arial", 14, "bold")
    )


for i in range(5):
    mt = turtle.Turtle()
    if MT_GIF:
        mt.shape(MT_GIF)
    else:
        mt.shape("circle")
        mt.color(random.choice(["red", "orange", "pink"]))
    mt.penup()
    mt.goto(-200 + i * 100, 150)
    muc_tieu.append(mt)


def ban():
    if thang:
        return
    phat_am("ban.wav")
    vien = turtle.Turtle()
    vien.shape("circle")
    vien.color("white")
    vien.shapesize(0.4, 0.4)
    vien.penup()
    vien.goto(sung.xcor(), sung.ycor() + 20)
    dan.append(vien)


def cap_nhat():
    global diem, thang
    if thang:
        return

    for vien in dan[:]:
        vien.sety(vien.ycor() + 8)
        if vien.ycor() > 260:
            vien.hideturtle()
            dan.remove(vien)
            continue
        for mt in muc_tieu[:]:
            if vien.distance(mt) < NGUONG_TRUNG:
                mt.hideturtle()
                muc_tieu.remove(mt)
                vien.hideturtle()
                dan.remove(vien)
                diem += 10
                phat_am("trung.wav")
                ve_bang()
                break

    if not muc_tieu:
        thang = True
        phat_am("thang.wav")
        bang.clear()
        bang.goto(0, 0)
        bang.write(
            f"🎉 THẮNG!\nĐiểm: {diem}",
            align="center",
            font=("Arial", 22, "bold")
        )
        man_hinh.update()
        return

    man_hinh.update()
    man_hinh.ontimer(cap_nhat, 40)


def trai():
    if not thang:
        sung.setx(max(sung.xcor() - 30, -270))
        man_hinh.update()


def phai():
    if not thang:
        sung.setx(min(sung.xcor() + 30, 270))
        man_hinh.update()


man_hinh.listen()
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")
man_hinh.onkey(ban, "space")

ve_bang()
man_hinh.update()
cap_nhat()
turtle.done()
