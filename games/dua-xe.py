"""
Game: Đua xe 🏎️
Học viện Turtle Python - Lớp 6

Phím ← → để tránh xe đối lưu
"""
import turtle
import random

man_hinh = turtle.Screen()
man_hinh.title("Đua xe 🏎️")
man_hinh.bgcolor("darkgreen")  # lề cỏ hai bên
man_hinh.setup(width=400, height=600)
man_hinh.tracer(0)

# Ba làn đường cố định
LAN_XE = [-100, 0, 100]


def ve_duong():
    """Vẽ mặt đường xám, lề trắng và vạch phân làn."""
    but = turtle.Turtle()
    but.hideturtle()
    but.speed(0)
    but.penup()

    # Mặt đường xám (giữa hai lề)
    but.goto(-150, -300)
    but.color("gray", "gray")
    but.begin_fill()
    but.pendown()
    but.goto(150, -300)
    but.goto(150, 300)
    but.goto(-150, 300)
    but.goto(-150, -300)
    but.end_fill()

    # Lề đường trái / phải (vạch liền trắng)
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

    # Vạch đứt phân 3 làn (vàng)
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
    xe.shape("square")
    xe.color(random.choice(["red", "orange", "purple"]))
    xe.shapesize(stretch_wid=2, stretch_len=3)
    xe.penup()
    xe.goto(lan, 300)
    xe_doi.append(xe)


def cham_xe(xe):
    """Va chạm hình chữ nhật — xe shapesize(2,3) ≈ 40×60, không dùng distance()."""
    if abs(xe.xcor() - xe_em.xcor()) < 60:
        if abs(xe.ycor() - xe_em.ycor()) < 40:
            return True
    return False


def cap_nhat():
    global diem, song
    if not song:
        return

    for xe in xe_doi[:]:
        xe.sety(xe.ycor() - 6)

        # Xe vượt qua → +10 điểm
        if xe.ycor() < -300:
            xe.hideturtle()
            xe_doi.remove(xe)
            diem = diem + 10
            ve_bang()
            continue

        if cham_xe(xe):
            song = False
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
