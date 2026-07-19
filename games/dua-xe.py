"""
Game: Đua xe 🏎️
Học viện Turtle Python - Lớp 6
Phím ← → tránh xe đối lưu trên đường
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Đua xe 🏎️")
man_hinh.bgcolor("gray")
man_hinh.setup(width=400, height=600)
man_hinh.tracer(0)

# Xe của em
xe_em = turtle.Turtle()
xe_em.shape("square")
xe_em.color("blue")
xe_em.shapesize(stretch_wid=2, stretch_len=3)
xe_em.penup()
xe_em.goto(0, -220)

xe_doi = []
diem = 0
song = True

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("white")
bang.goto(0, 270)


def ve_bang():
    bang.clear()
    bang.write(f"Quãng đường: {diem}m  |  ← →", align="center", font=("Arial", 13, "bold"))


def tao_xe_doi():
    xe = turtle.Turtle()
    xe.shape("square")
    xe.color(random.choice(["red", "orange", "purple"]))
    xe.shapesize(stretch_wid=2, stretch_len=3)
    xe.penup()
    xe.goto(random.choice([-100, 0, 100]), 300)
    xe_doi.append(xe)


def cap_nhat():
    global diem, song
    if not song:
        return

    for xe in xe_doi[:]:
        xe.sety(xe.ycor() - 6)
        if xe.ycor() < -300:
            xe.hideturtle()
            xe_doi.remove(xe)
            diem += 10
            ve_bang()
        if xe.distance(xe_em) < 35:
            song = False
            bang.goto(0, 0)
            bang.write(f"TÔNG RỒI!\nQuãng đường: {diem}m",
                       align="center", font=("Arial", 18, "bold"))
            return

    if random.random() < 0.03:
        tao_xe_doi()

    man_hinh.update()
    man_hinh.ontimer(cap_nhat, 40)


def trai():
    if song:
        xe_em.setx(max(xe_em.xcor() - 100, -150))
        man_hinh.update()


def phai():
    if song:
        xe_em.setx(min(xe_em.xcor() + 100, 150))
        man_hinh.update()


man_hinh.listen()
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")

ve_bang()
cap_nhat()
turtle.done()
