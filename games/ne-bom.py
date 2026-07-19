"""
Game: Né bom 💣
Học viện Turtle Python - Lớp 6

← → né bom rơi

Âm thanh (tùy chọn) — đặt cạnh file ne-bom.py:
  nhac-nen.wav, no.wav
"""
import random
import time
import turtle

# --- Âm thanh (Windows, tùy chọn) ---
try:
    import winsound

    def phat_nhac_nen():
        try:
            winsound.PlaySound(
                "nhac-nen.wav",
                winsound.SND_ASYNC | winsound.SND_LOOP
            )
        except Exception:
            pass

    def dung_nhac_nen():
        try:
            winsound.PlaySound(None, winsound.SND_PURGE)
        except Exception:
            pass

    def phat_am(ten_file):
        try:
            winsound.PlaySound(ten_file, winsound.SND_ASYNC)
        except Exception:
            pass
except ImportError:
    def phat_nhac_nen():
        pass

    def dung_nhac_nen():
        pass

    def phat_am(ten_file):
        pass


man_hinh = turtle.Screen()
man_hinh.setup(600, 600)
man_hinh.title("Né Bom 💣")
man_hinh.bgcolor("black")
man_hinh.tracer(0)

nguoi = turtle.Turtle()
nguoi.shape("turtle")
nguoi.color("lime")
nguoi.penup()
nguoi.goto(0, -250)

diem = 0
song = True

bang = turtle.Turtle()
bang.hideturtle()
bang.color("white")
bang.penup()
bang.goto(0, 260)

thong_bao = turtle.Turtle()
thong_bao.hideturtle()
thong_bao.color("yellow")
thong_bao.penup()

# 3 quả bom + tốc độ riêng (list song song — dễ hiểu lớp 6)
danh_sach_bom = []
toc_do_bom = []

for i in range(3):
    bom = turtle.Turtle()
    bom.shape("circle")
    bom.color("red")
    bom.penup()
    danh_sach_bom.append(bom)
    toc_do_bom.append(random.randint(6, 12))


def ve_diem():
    bang.clear()
    bang.write(
        f"Điểm: {diem}",
        align="center",
        font=("Arial", 16, "bold")
    )


def dat_lai_bom():
    for i in range(len(danh_sach_bom)):
        danh_sach_bom[i].goto(
            random.randint(-270, 270),
            random.randint(280, 500)
        )
        toc_do_bom[i] = random.randint(6, 12)


def game_over():
    dung_nhac_nen()
    phat_am("no.wav")
    thong_bao.goto(0, 0)
    thong_bao.write(
        f"GAME OVER\nĐiểm: {diem}",
        align="center",
        font=("Arial", 24, "bold")
    )


def trai():
    x = nguoi.xcor() - 30
    if x < -280:
        x = -280
    nguoi.setx(x)


def phai():
    x = nguoi.xcor() + 30
    if x > 280:
        x = 280
    nguoi.setx(x)


man_hinh.listen()
man_hinh.onkeypress(trai, "Left")
man_hinh.onkeypress(phai, "Right")

ve_diem()
dat_lai_bom()
phat_nhac_nen()

while True:
    man_hinh.update()
    if not song:
        break

    for i in range(len(danh_sach_bom)):
        bom = danh_sach_bom[i]
        bom.sety(bom.ycor() - toc_do_bom[i])

        if bom.ycor() < -320:
            diem += 1
            ve_diem()
            bom.goto(
                random.randint(-270, 270),
                random.randint(320, 500)
            )
            toc_do_bom[i] = random.randint(6, 12)

        if bom.distance(nguoi) < 25:
            song = False
            game_over()
            man_hinh.update()
            break

    time.sleep(0.01)

turtle.done()
