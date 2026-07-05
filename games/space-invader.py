"""
Game: Space Invader 👾
Học viện Turtle Python - Lớp 6
← → di chuyển, SPACE bắn tàu ngoài hành tinh
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Space Invader 👾")
man_hinh.bgcolor("black")
man_hinh.setup(width=600, height=500)
man_hinh.tracer(0)

# Tàu em
tau = turtle.Turtle()
tau.shape("triangle")
tau.color("cyan")
tau.penup()
tau.goto(0, -200)
tau.setheading(90)

dan = []
ke_dich = []
diem = 0
song = True

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("white")
bang.goto(0, 220)


def ve_bang():
    bang.clear()
    bang.write(f"Điểm: {diem}  |  ← → SPACE",
               align="center", font=("Arial", 14, "bold"))


def tao_ke_dich():
    for hang in range(3):
        for cot in range(6):
            ke = turtle.Turtle()
            ke.shape("square")
            ke.color(random.choice(["red", "magenta", "orange"]))
            ke.shapesize(stretch_wid=1.5, stretch_len=1.5)
            ke.penup()
            ke.goto(-200 + cot * 70, 120 - hang * 50)
            ke_dich.append(ke)


def ban():
    if not song:
        return
    vien = turtle.Turtle()
    vien.shape("circle")
    vien.color("yellow")
    vien.shapesize(0.3, 0.3)
    vien.penup()
    vien.goto(tau.xcor(), tau.ycor() + 20)
    dan.append(vien)


def cap_nhat():
    global diem, song
    if not song:
        return

    for vien in dan[:]:
        vien.sety(vien.ycor() + 10)
        if vien.ycor() > 250:
            vien.hideturtle()
            dan.remove(vien)
            continue
        for ke in ke_dich[:]:
            if vien.distance(ke) < 25:
                ke.hideturtle()
                ke_dich.remove(ke)
                vien.hideturtle()
                dan.remove(vien)
                diem += 10
                ve_bang()
                break

    if not ke_dich:
        song = False
        bang.goto(0, 0)
        bang.write("🎉 THẮNG!\nĐiểm: " + str(diem),
                   align="center", font=("Arial", 22, "bold"))
        return

    for ke in ke_dich:
        if ke.ycor() < -180:
            song = False
            bang.goto(0, 0)
            bang.write("GAME OVER!", align="center", font=("Arial", 20, "bold"))
            return

    man_hinh.update()
    man_hinh.ontimer(cap_nhat, 50)


def trai():
    if song:
        tau.setx(max(tau.xcor() - 25, -270))


def phai():
    if song:
        tau.setx(min(tau.xcor() + 25, 270))


man_hinh.listen()
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")
man_hinh.onkey(ban, "space")

tao_ke_dich()
ve_bang()
cap_nhat()
turtle.done()
