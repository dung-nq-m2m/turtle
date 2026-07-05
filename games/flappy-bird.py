"""
Game: Flappy Bird 🐦
Học viện Turtle Python - Lớp 6
Nhấn SPACE để rùa bay lên, tránh ống xanh
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Flappy Bird 🐦")
man_hinh.bgcolor("skyblue")
man_hinh.setup(width=500, height=600)
man_hinh.tracer(0)

# Chim (rùa)
chim = turtle.Turtle()
chim.shape("turtle")
chim.color("yellow")
chim.penup()
chim.goto(-150, 0)

van_toc = 0
trong_luc = -0.4
song = True
diem = 0

ong = []
for _ in range(2):
    tren = turtle.Turtle()
    tren.shape("square")
    tren.color("green")
    tren.shapesize(stretch_wid=5, stretch_len=random.randint(4, 8))
    tren.penup()
    duoi = turtle.Turtle()
    duoi.shape("square")
    duoi.color("green")
    duoi.shapesize(stretch_wid=5, stretch_len=random.randint(4, 8))
    duoi.penup()
    ong.append((tren, duoi))

def dat_ong(cap, x):
    khoang = random.randint(80, 160)
    tren, duoi = cap
    tren.goto(x, khoang + 100)
    duoi.goto(x, khoang - 100)

dat_ong(ong[0], 100)
dat_ong(ong[1], 350)

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.goto(0, 260)


def ve_bang():
    bang.clear()
    bang.write(f"Điểm: {diem}  |  SPACE = bay", align="center", font=("Arial", 14, "bold"))


def game_loop():
    global van_toc, song, diem
    if not song:
        return

    van_toc += trong_luc
    chim.sety(chim.ycor() + van_toc)

    if chim.ycor() > 280 or chim.ycor() < -280:
        ket_thuc()
        return

    for tren, duoi in ong:
        tren.setx(tren.xcor() - 4)
        duoi.setx(duoi.xcor() - 4)
        if tren.xcor() < -280:
            tren.setx(280)
            duoi.setx(280)
            dat_ong((tren, duoi), 280)
            diem += 1
            ve_bang()
        if chim.distance(tren) < 40 or chim.distance(duoi) < 40:
            ket_thuc()
            return

    man_hinh.update()
    man_hinh.ontimer(game_loop, 30)


def bay():
    global van_toc
    if song:
        van_toc = 6


def ket_thuc():
    global song
    song = False
    bang.goto(0, 0)
    bang.write(f"GAME OVER!\nĐiểm: {diem}", align="center", font=("Arial", 20, "bold"))


man_hinh.listen()
man_hinh.onkey(bay, "space")

ve_bang()
game_loop()
turtle.done()
