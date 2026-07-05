"""
Game: Hứng táo 🍎
Học viện Turtle Python - Lớp 6
Dùng phím ← → để di chuyển rùa hứng táo
"""
import turtle
import random

# Thiết lập màn hình
man_hinh = turtle.Screen()
man_hinh.title("Hứng táo 🍎")
man_hinh.bgcolor("lightblue")
man_hinh.setup(width=600, height=500)

# Rùa (giỏ hứng)
rua = turtle.Turtle()
rua.shape("turtle")
rua.color("green")
rua.penup()
rua.goto(0, -200)

# Táo
tao = turtle.Turtle()
tao.shape("circle")
tao.color("red")
tao.penup()
tao.hideturtle()

diem = 0
pen = turtle.Turtle()
pen.hideturtle()
pen.penup()
pen.goto(0, 220)
pen.write("Điểm: 0", align="center", font=("Arial", 16, "bold"))


def roi_tao():
    x = random.randint(-250, 250)
    tao.showturtle()
    tao.goto(x, 250)
    tao.sety(-250)


def hung_tao():
    global diem
    if abs(rua.xcor() - tao.xcor()) < 40:
        diem += 1
        pen.clear()
        pen.write(f"Điểm: {diem}", align="center", font=("Arial", 16, "bold"))
        tao.hideturtle()
        man_hinh.ontimer(roi_tao, 500)


def trai():
    rua.setx(rua.xcor() - 30)


def phai():
    rua.setx(rua.xcor() + 30)


man_hinh.listen()
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")
man_hinh.onkey(hung_tao, "space")

roi_tao()
man_hinh.onscreenclick(lambda x, y: hung_tao())

turtle.done()
