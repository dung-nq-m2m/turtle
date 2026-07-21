"""
Game: Mê cung 🏰
Học viện Turtle Python - Lớp 6

↑ ↓ ← → tìm ngôi sao vàng

Mỗi bức tường là một đoạn thẳng (x1, y1) → (x2, y2)
Logic: tính vị trí mới → kiểm tra tường → mới được đi

Điểm: +5 mỗi bước đi được
Thưởng khi thắng: càng nhanh càng nhiều điểm
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

# Mê cung hình chữ S — Start (-140, 140) → đích (140, -140)
DANH_SACH_TUONG = [
    (-180, 180, 180, 180),
    (180, 180, 180, -180),
    (180, -180, -180, -180),
    (-180, -180, -180, 180),
    (-180, 50, 100, 50),
    (-100, -50, 180, -50),
    (-180, -130, 100, -130),
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
thoi_gian = 0
diem = 0
so_buoc = 0

bang = turtle.Turtle()
bang.hideturtle()
bang.penup()
bang.color("black")

thong_bao = turtle.Turtle()
thong_bao.hideturtle()
thong_bao.penup()
thong_bao.goto(0, -210)
thong_bao.write(
    "↑ ↓ ← → tìm sao vàng — không xuyên tường!",
    align="center",
    font=("Arial", 11, "bold")
)


def ve_bang():
    bang.clear()
    bang.goto(0, 215)
    bang.write(
        f"⏱ {thoi_gian}s   |   Điểm: {diem}   |   Bước: {so_buoc}",
        align="center",
        font=("Arial", 14, "bold")
    )


def dem_gio():
    """Đếm thời gian mỗi giây — dừng khi thắng."""
    global thoi_gian
    if thang:
        return
    thoi_gian = thoi_gian + 1
    ve_bang()
    man_hinh.update()
    man_hinh.ontimer(dem_gio, 1000)


def cham_tuong(x_cu, y_cu, x_moi, y_moi):

    for x1, y1, x2, y2 in DANH_SACH_TUONG:
        # ----- Tường ngang -----
        if y1 == y2:
            if min(x1, x2) - KHOANG_CACH_TUONG <= x_moi <= max(x1, x2) + KHOANG_CACH_TUONG:
                if min(y_cu, y_moi) <= y1 <= max(y_cu, y_moi):
                    return True

                if abs(y_moi - y1) < KHOANG_CACH_TUONG:
                    return True
        # ----- Tường dọc -----
        else:
            if min(y1, y2) - KHOANG_CACH_TUONG <= y_moi <= max(y1, y2) + KHOANG_CACH_TUONG:
                if min(x_cu, x_moi) <= x1 <= max(x_cu, x_moi):
                    return True
                if abs(x_moi - x1) < KHOANG_CACH_TUONG:
                    return True
    return False


def kiem_tra_thang():
    global thang, diem
    if rua.distance(dich) < 25:
        thang = True
        # Thưởng nhanh: tối đa 200, mỗi giây trừ 5
        thuong = max(0, 200 - thoi_gian * 5)
        diem = diem + thuong
        ve_bang()
        thong_bao.clear()
        thong_bao.goto(0, 0)
        thong_bao.write(
            f"🎉 THẮNG RỒI!\n⏱ {thoi_gian}s  |  Điểm: {diem}\n(+{thuong} thưởng nhanh)",
            align="center",
            font=("Arial", 18, "bold")
        )


def di_chuyen(huong):
    """Tính vị trí mới → kiểm tra tường → mới được đi."""
    global diem, so_buoc
    if thang:
        return

    x_cu = rua.xcor()
    y_cu = rua.ycor()

    x_moi = x_cu
    y_moi = y_cu

    if huong == 90:
        y_moi = y_moi + BUOC
    elif huong == 270:
        y_moi = y_moi - BUOC
    elif huong == 180:
        x_moi = x_moi - BUOC
    elif huong == 0:
        x_moi = x_moi + BUOC

    rua.setheading(huong)

    if cham_tuong(x_cu, y_cu, x_moi, y_moi):
        return

    rua.goto(x_moi, y_moi)
    so_buoc = so_buoc + 1
    diem = diem + 5
    ve_bang()
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

ve_bang()
man_hinh.update()
man_hinh.ontimer(dem_gio, 1000)

turtle.done()
