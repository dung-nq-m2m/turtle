"""
Game: Mê cung 🏰
Học viện Turtle Python - Lớp 6
Phím ↑ ↓ ← → để rùa tìm lối ra (hình sao vàng)
"""
import turtle

man_hinh = turtle.Screen()
man_hinh.title("Mê cung 🏰")
man_hinh.bgcolor("white")
man_hinh.setup(width=500, height=500)

# Vẽ tường mê cung
tuong = turtle.Turtle()
tuong.speed(0)
tuong.pensize(3)
tuong.color("navy")

def ve_tuong(dai):
    tuong.forward(dai)

def ve_me_cung():
    tuong.penup()
    tuong.goto(-180, 180)
    tuong.pendown()
    for dai in [360, 80, 200, 80, 200, 80, 120, 80, 240, 80, 200]:
        ve_tuong(dai)
        tuong.right(90)

ve_me_cung()

# Đích (sao vàng)
dich = turtle.Turtle()
dich.shape("circle")
dich.color("gold")
dich.penup()
dich.goto(160, -160)
dich.shapesize(1.5, 1.5)

# Rùa người chơi
rua = turtle.Turtle()
rua.shape("turtle")
rua.color("green")
rua.penup()
rua.goto(-160, 160)
rua.setheading(270)

buoc = 20
thang = False

thong_bao = turtle.Turtle()
thong_bao.hideturtle()
thong_bao.penup()
thong_bao.goto(0, 210)
thong_bao.write("↑↓←→ di chuyển — tìm sao vàng!", align="center", font=("Arial", 12, "bold"))


def kiem_tra_thang():
    global thang
    if abs(rua.xcor() - dich.xcor()) < 30 and abs(rua.ycor() - dich.ycor()) < 30:
        thang = True
        thong_bao.clear()
        thong_bao.write("🎉 THẮNG RỒI!", align="center", font=("Arial", 22, "bold"))


def len():
    if not thang:
        rua.setheading(90)
        rua.forward(buoc)
        kiem_tra_thang()


def xuong():
    if not thang:
        rua.setheading(270)
        rua.forward(buoc)
        kiem_tra_thang()


def trai():
    if not thang:
        rua.setheading(180)
        rua.forward(buoc)
        kiem_tra_thang()


def phai():
    if not thang:
        rua.setheading(0)
        rua.forward(buoc)
        kiem_tra_thang()


man_hinh.listen()
man_hinh.onkey(len, "Up")
man_hinh.onkey(xuong, "Down")
man_hinh.onkey(trai, "Left")
man_hinh.onkey(phai, "Right")

turtle.done()
