"""
Game: Đua xe 🏎️
Học viện Turtle Python - Lớp 6

Phím ← → để tránh xe đối lưu

Hình ảnh sẵn có (cùng thư mục với file này):
  xe-em.gif       — xe người chơi (xanh)
  xe-doi.gif      — xe đối thủ đỏ
  xe-doi-cam.gif  — xe đối thủ cam
  xe-doi-tim.gif  — xe đối thủ tím
  nen-duong.gif   — nền (tùy chọn)
  tong.wav        — tiếng tông (tùy chọn)

Xem: assets/huong-dan-dua-xe.md
"""
import os
import random
import turtle

THU_MUC = os.path.dirname(os.path.abspath(__file__))


def co_file(ten):
    path = os.path.join(THU_MUC, ten)
    return path if os.path.isfile(path) else None


try:
    import winsound

    def phat_am(ten_file):
        path = co_file(ten_file)
        if path:
            winsound.PlaySound(path, winsound.SND_ASYNC)
except ImportError:
    def phat_am(ten_file):
        pass


man_hinh = turtle.Screen()
man_hinh.title("Đua xe 🏎️")
man_hinh.setup(width=400, height=600)
man_hinh.tracer(0)

nen = co_file("nen-duong.gif")
if nen:
    man_hinh.bgpic(nen)
else:
    man_hinh.bgcolor("darkgreen")

# Đăng ký hình ô tô GIF (đã tạo sẵn)
XE_EM_GIF = co_file("xe-em.gif")
XE_DOI_GIFS = [
    f for f in (
        co_file("xe-doi.gif"),
        co_file("xe-doi-cam.gif"),
        co_file("xe-doi-tim.gif"),
    ) if f
]

if XE_EM_GIF:
    man_hinh.addshape(XE_EM_GIF)
for gif in XE_DOI_GIFS:
    man_hinh.addshape(gif)

# Ba làn đường cố định
LAN_XE = [-100, 0, 100]


def ve_duong():
    """Vẽ mặt đường xám, lề trắng và vạch phân làn."""
    if nen:
        return  # đã dùng hình nền

    but = turtle.Turtle()
    but.hideturtle()
    but.speed(0)
    but.penup()

    but.goto(-150, -300)
    but.color("gray", "gray")
    but.begin_fill()
    but.pendown()
    but.goto(150, -300)
    but.goto(150, 300)
    but.goto(-150, 300)
    but.goto(-150, -300)
    but.end_fill()

    but.pensize(5)
    but.color("white")
    but.penup()
    but.goto(-150, -300)
    but.pendown()
    but.goto(-150, 300)

    but.penup()
    but.goto(150, -300)
    but.pendown()
    but.goto(150, 300)

    but.pensize(3)
    but.color("yellow")
    for x in [-50, 50]:
        y = -280
        while y < 280:
            but.penup()
            but.goto(x, y)
            but.pendown()
            but.goto(x, y + 30)
            y = y + 60


ve_duong()

# Xe của em
xe_em = turtle.Turtle()
if XE_EM_GIF:
    xe_em.shape(XE_EM_GIF)
else:
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


def ve_bang():
    bang.clear()
    bang.goto(0, 270)
    bang.write(
        "Điểm: " + str(diem) + "  |  ← →",
        align="center",
        font=("Arial", 13, "bold")
    )


def lan_co_xe(x):
    """True nếu đã có xe đối ở phía trên cùng làn — tránh chồng xe."""
    for xe in xe_doi:
        if xe.xcor() == x and xe.ycor() > 180:
            return True
    return False


def tao_xe_doi():
    lan = random.choice(LAN_XE)
    if lan_co_xe(lan):
        return

    xe = turtle.Turtle()
    if XE_DOI_GIFS:
        xe.shape(random.choice(XE_DOI_GIFS))
    else:
        xe.shape("square")
        xe.color(random.choice(["red", "orange", "purple"]))
        xe.shapesize(stretch_wid=2, stretch_len=3)
    xe.penup()
    xe.goto(lan, 300)
    xe_doi.append(xe)


def cham_xe(xe):
    """Va chạm hình chữ nhật — xe GIF ≈ 40×60."""
    if abs(xe.xcor() - xe_em.xcor()) < 40:
        if abs(xe.ycor() - xe_em.ycor()) < 55:
            return True
    return False


def cap_nhat():
    global diem, song
    if not song:
        return

    for xe in xe_doi[:]:
        xe.sety(xe.ycor() - 6)

        if xe.ycor() < -300:
            xe.hideturtle()
            xe_doi.remove(xe)
            diem = diem + 10
            ve_bang()
            continue

        if cham_xe(xe):
            song = False
            phat_am("tong.wav")
            bang.clear()
            bang.goto(0, 0)
            bang.write(
                "TÔNG RỒI!\nĐiểm: " + str(diem),
                align="center",
                font=("Arial", 18, "bold")
            )
            man_hinh.update()
            return

    if random.random() < 0.03:
        tao_xe_doi()

    man_hinh.update()
    man_hinh.ontimer(cap_nhat, 40)


def sang_trai():
    if song:
        xe_em.setx(max(xe_em.xcor() - 100, -100))


def sang_phai():
    if song:
        xe_em.setx(min(xe_em.xcor() + 100, 100))


man_hinh.listen()
man_hinh.onkey(sang_trai, "Left")
man_hinh.onkey(sang_phai, "Right")

ve_bang()
cap_nhat()
turtle.done()
