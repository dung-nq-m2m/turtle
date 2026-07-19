"""
Game: Hứng táo 🍎
Học viện Turtle Python - Lớp 6

← → di chuyển · Space hứng táo

Ảnh/âm (tùy chọn) — đặt cạnh file hung-tao.py:
  nen-vuon.gif, tao.gif, hung.wav, roi.wav
"""
import random
import turtle

# --- Âm thanh (Windows, tùy chọn) ---
try:
    import winsound

    def phat_am(ten_file):
        try:
            winsound.PlaySound(ten_file, winsound.SND_ASYNC)
        except Exception:
            pass
except ImportError:
    def phat_am(ten_file):
        pass


man_hinh = turtle.Screen()
man_hinh.title("Hứng táo 🍎")
man_hinh.setup(width=600, height=500)
man_hinh.bgcolor("lightblue")

# Nếu có file nền cạnh hung-tao.py thì bỏ dấu # dòng dưới:
# man_hinh.bgpic("nen-vuon.gif")

rua = turtle.Turtle()
rua.shape("turtle")
rua.color("green")
rua.penup()
rua.goto(0, -200)

tao = turtle.Turtle()
tao.shape("circle")
tao.color("red")
tao.penup()
tao.hideturtle()

# Nếu có tao.gif cạnh file .py:
# try:
#     man_hinh.addshape("tao.gif")
#     tao.shape("tao.gif")
# except Exception:
#     pass

diem = 0
pen = turtle.Turtle()
pen.hideturtle()
pen.penup()
pen.goto(0, 220)
pen.color("black")


def ve_diem():
    pen.clear()
    pen.write(f"Điểm: {diem}", align="center", font=("Arial", 16, "bold"))


def roi_tao():
    x = random.randint(-250, 250)
    tao.showturtle()
    tao.goto(x, 250)
    phat_am("roi.wav")
    tao.sety(-250)


def hung_tao():
    global diem
    if abs(rua.xcor() - tao.xcor()) < 40:
        diem += 1
        ve_diem()
        phat_am("hung.wav")
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

ve_diem()
roi_tao()
turtle.done()
