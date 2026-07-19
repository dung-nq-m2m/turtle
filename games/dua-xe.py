"""
Game: Đua xe 🏎️
Học viện Turtle Python - Lớp 6

Phím ← → để tránh xe đối lưu
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

# Ba làn đường cố định
LAN_XE = [-100, 0, 100]

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
    """Va chạm hình chữ nhật — phù hợp xe square, không dùng distance()."""
    if abs(xe.xcor() - xe_em.xcor()) < 50:
        if abs(xe.ycor() - xe_em.ycor()) < 35:
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
