"""
Game: Né bom 💣
Học viện Turtle Python - Lớp 6
Phím ← → di chuyển, tránh bom rơi xuống
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Né bom 💣")
man_hinh.bgcolor("black")
man_hinh.setup(width=600, height=500)
man_hinh.tracer(0)

# Người chơi
nguoi = turtle.Turtle()
nguoi.shape("turtle")
nguoi.color("lime")
nguoi.penup()
nguoi.goto(0, -200)

# Bom
bom = turtle.Turtle()
bom.shape("circle")
bom.color("red")
bom.penup()
bom.hideturtle()

diem = 0
song = True
toc_do = 8

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("white")
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
        ve_bang()
        man_hinh.ontimer(bom_moi, 300)
        return
    if abs(bom.xcor() - nguoi.xcor()) < 25 and abs(bom.ycor() - nguoi.ycor()) < 25:
        song = False
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
