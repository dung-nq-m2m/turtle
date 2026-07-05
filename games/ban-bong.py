"""
Game: Bắn bóng ⚽
Học viện Turtle Python - Lớp 6
← → di chuyển súng, SPACE bắn trúng mục tiêu
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Bắn bóng ⚽")
man_hinh.bgcolor("navy")
man_hinh.setup(width=600, height=500)
man_hinh.tracer(0)

sung = turtle.Turtle()
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
    bang.write(f"Điểm: {diem}  |  ← → Space",
               align="center", font=("Arial", 14, "bold"))


for i in range(5):
    mt = turtle.Turtle()
    mt.shape("circle")
    mt.color(random.choice(["red", "orange", "pink"]))
    mt.penup()
    mt.goto(-200 + i * 100, 150)
    muc_tieu.append(mt)


def ban():
    if thang:
        return
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
            if vien.distance(mt) < 25:
                mt.hideturtle()
                muc_tieu.remove(mt)
                vien.hideturtle()
                dan.remove(vien)
                diem += 10
                ve_bang()
                break

    if not muc_tieu:
        thang = True
        bang.goto(0, 0)
        bang.write(f"🎉 THẮNG!\nĐiểm: {diem}",
                   align="center", font=("Arial", 22, "bold"))
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
cap_nhat()
turtle.done()
