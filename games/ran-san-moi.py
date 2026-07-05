"""
Game: Rắn săn mồi 🐍
Học viện Turtle Python - Lớp 6
Phím ↑ ↓ ← → — ăn táo đỏ, đừng cắn đuôi!
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Rắn săn mồi 🐍")
man_hinh.bgcolor("black")
man_hinh.setup(width=600, height=600)
man_hinh.tracer(0)

KICH_THUOC = 20
huong = "stop"
than_ran = []
diem = 0

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("white")
bang.goto(0, 270)


def ve_bang():
    bang.clear()
    bang.write(f"Điểm: {diem}  |  ↑↓←→", align="center", font=("Arial", 14, "bold"))


def tao_do():
    do = turtle.Turtle()
    do.shape("circle")
    do.color("red")
    do.penup()
    do.speed(0)
    x = random.randint(-280 // KICH_THUOC, 280 // KICH_THUOC) * KICH_THUOC
    y = random.randint(-260 // KICH_THUOC, 260 // KICH_THUOC) * KICH_THUOC
    do.goto(x, y)
    return do


def khoi_tao():
    dau = turtle.Turtle()
    dau.shape("square")
    dau.color("lime")
    dau.penup()
    dau.goto(0, 0)
    than_ran.append(dau)
    for i in range(1, 4):
        p = turtle.Turtle()
        p.shape("square")
        p.color("green")
        p.penup()
        p.goto(-KICH_THUOC * i, 0)
        than_ran.append(p)


def di_chuyen():
    global diem, huong
    if huong == "stop":
        man_hinh.ontimer(di_chuyen, 100)
        return

    x, y = than_ran[0].xcor(), than_ran[0].ycor()
    if huong == "up":
        y += KICH_THUOC
    elif huong == "down":
        y -= KICH_THUOC
    elif huong == "left":
        x -= KICH_THUOC
    elif huong == "right":
        x += KICH_THUOC

    if abs(x) > 290 or abs(y) > 280:
        game_over()
        return

    for p in than_ran[1:]:
        if p.distance(x, y) < KICH_THUOC:
            game_over()
            return

    for i in range(len(than_ran) - 1, 0, -1):
        than_ran[i].goto(than_ran[i - 1].pos())
    than_ran[0].goto(x, y)

    if than_ran[0].distance(do) < KICH_THUOC:
        diem += 1
        ve_bang()
        do.goto(random.randint(-14, 14) * KICH_THUOC,
                random.randint(-13, 13) * KICH_THUOC)
        duoi = turtle.Turtle()
        duoi.shape("square")
        duoi.color("green")
        duoi.penup()
        duoi.goto(than_ran[-1].pos())
        than_ran.append(duoi)

    man_hinh.update()
    man_hinh.ontimer(di_chuyen, 150)


def game_over():
    bang.goto(0, 0)
    bang.write(f"GAME OVER!\nĐiểm: {diem}", align="center", font=("Arial", 20, "bold"))


def len():  global huong; huong = "up"
def xuong(): global huong; huong = "down"
def trai(): global huong; huong = "left"
def phai(): global huong; huong = "right"

man_hinh.listen()
man_hinh.onkey(len, "Up")
man_hinh.onkey(xuong, "Down")
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")

khoi_tao()
do = tao_do()
ve_bang()
di_chuyen()

turtle.done()
