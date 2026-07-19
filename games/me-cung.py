"""
Game: Mê cung 🏰
Học viện Turtle Python - Lớp 6

↑ ↓ ← → tìm ngôi sao vàng

Mỗi bức tường là một đoạn thẳng (x1, y1) → (x2, y2)
Logic: tính vị trí mới → kiểm tra tường → mới được đi
"""
import turtle

man_hinh = turtle.Screen()
man_hinh.title("Mê cung 🏰")
man_hinh.bgcolor("white")
man_hinh.setup(500, 500)
man_hinh.tracer(0)

tuong = turtle.Turtle()
tuong.speed(0)
tuong.pensize(4)
tuong.color("navy")
tuong.hideturtle()

KHOANG_CACH_TUONG = 10
BUOC = 20

# Mê cung hình chữ S — đường đi đã BFS kiểm chứng
# Start (-140, 140) → đích (140, -140)
DANH_SACH_TUONG = [
    # Ngoài
    (-180, 180, 180, 180),
    (180, 180, 180, -180),
    (180, -180, -180, -180),
    (-180, -180, -180, 180),

    # Hàng 1 — khe PHẢI (x > 100)
    (-180, 50, 100, 50),

    # Hàng 2 — khe TRÁI (x < -100)
    (-100, -50, 180, -50),

    # Hàng 3 — khe PHẢI tới đích (x > 100)
    (-180, -130, 100, -130),

    # Cột trang trí (không chặn đường chữ S)
    (40, 50, 40, 120),
    (-40, -50, -40, 20),
]


def ve_tuong(x1, y1, x2, y2):
    tuong.penup()
    tuong.goto(x1, y1)
    tuong.pendown()
    tuong.goto(x2, y2)


def ve_me_cung():
    for x1, y1, x2, y2 in DANH_SACH_TUONG:
        ve_tuong(x1, y1, x2, y2)


ve_me_cung()

dich = turtle.Turtle()
dich.shape("circle")
dich.color("gold")
dich.penup()
dich.goto(140, -140)
dich.shapesize(1.5, 1.5)

rua = turtle.Turtle()
rua.shape("turtle")
rua.color("green")
rua.penup()
rua.goto(-140, 140)
rua.setheading(270)

thang = False

thong_bao = turtle.Turtle()
thong_bao.hideturtle()
thong_bao.penup()
thong_bao.goto(0, 210)
thong_bao.write(
    "↑ ↓ ← → tìm sao vàng — không xuyên tường!",
    align="center",
    font=("Arial", 12, "bold")
)


def cham_tuong(x, y):
    for x1, y1, x2, y2 in DANH_SACH_TUONG:
        if y1 == y2:
            if min(x1, x2) - KHOANG_CACH_TUONG <= x <= max(x1, x2) + KHOANG_CACH_TUONG:
                if abs(y - y1) < KHOANG_CACH_TUONG:
                    return True
        elif x1 == x2:
            if min(y1, y2) - KHOANG_CACH_TUONG <= y <= max(y1, y2) + KHOANG_CACH_TUONG:
                if abs(x - x1) < KHOANG_CACH_TUONG:
                    return True
    return False


def kiem_tra_thang():
    global thang
    if rua.distance(dich) < 25:
        thang = True
        thong_bao.clear()
        thong_bao.goto(0, 0)
        thong_bao.write(
            "🎉 THẮNG RỒI!",
            align="center",
            font=("Arial", 22, "bold")
        )


def di_chuyen(huong):
    """Tính vị trí mới → kiểm tra tường → mới được đi."""
    if thang:
        return

    x_moi = rua.xcor()
    y_moi = rua.ycor()

    if huong == 90:
        y_moi = y_moi + BUOC
    elif huong == 270:
        y_moi = y_moi - BUOC
    elif huong == 180:
        x_moi = x_moi - BUOC
    elif huong == 0:
        x_moi = x_moi + BUOC

    rua.setheading(huong)

    if cham_tuong(x_moi, y_moi):
        return

    rua.goto(x_moi, y_moi)
    kiem_tra_thang()
    man_hinh.update()


def di_len():
    di_chuyen(90)


def di_xuong():
    di_chuyen(270)


def di_trai():
    di_chuyen(180)


def di_phai():
    di_chuyen(0)


man_hinh.listen()
man_hinh.onkey(di_len, "Up")
man_hinh.onkey(di_xuong, "Down")
man_hinh.onkey(di_trai, "Left")
man_hinh.onkey(di_phai, "Right")

man_hinh.update()
turtle.done()
