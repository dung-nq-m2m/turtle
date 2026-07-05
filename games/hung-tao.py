"""
Game: Hứng táo 🍎
Học viện Turtle Python - Lớp 6

Điều khiển: ← → di chuyển · Space hoặc click để hứng

Hình ảnh & âm thanh (tùy chọn):
  assets/images/nen-vuon.gif  — hình nền
  assets/images/tao.gif       — hình táo
  assets/sounds/hung.wav      — tiếng hứng trúng
  assets/sounds/roi.wav       — tiếng táo xuất hiện

Xem hướng dẫn chi tiết: assets/huong-dan-hung-tao.md (Chương 6: assets/HUONG-DAN-CHUONG-6.md)
"""
import os
import random
import turtle

# --- Đường dẫn assets (luôn đúng dù chạy từ đâu) ---
THU_MUC = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(THU_MUC, "assets", "images")
SND = os.path.join(THU_MUC, "assets", "sounds")

NGUONG_VA_CHAM = 40  # tăng lên 50–60 nếu dùng hình táo lớn


def co_file(*phan):
    duong_dan = os.path.join(*phan)
    return duong_dan if os.path.isfile(duong_dan) else None


# --- Âm thanh (Windows) ---
try:
    import winsound

    def phat_am(ten_file):
        path = co_file(SND, ten_file)
        if path:
            winsound.PlaySound(path, winsound.SND_ASYNC)
except ImportError:
    def phat_am(ten_file):
        pass  # Mac/Linux: bỏ qua hoặc dùng pygame sau này


# --- Màn hình ---
man_hinh = turtle.Screen()
man_hinh.title("Hứng táo 🍎")
man_hinh.setup(width=600, height=500)

nen = co_file(IMG, "nen-vuon.gif")
if nen:
    man_hinh.bgpic(nen)
else:
    man_hinh.bgcolor("lightblue")

# --- Hình táo: ưu tiên GIF, không có thì vẽ đa giác ---
TAO_GIF = co_file(IMG, "tao.gif")
if TAO_GIF:
    man_hinh.addshape(TAO_GIF)
    HINH_TAO = TAO_GIF
else:
    HINH_TAO = "tao_ve"
    man_hinh.register_shape(HINH_TAO, (
        (0, 20), (8, 10), (10, 0), (8, -12), (0, -18),
        (-8, -12), (-10, 0), (-8, 10),
    ))

# --- Nhân vật ---
rua = turtle.Turtle()
rua.shape("turtle")
rua.color("green")
rua.penup()
rua.goto(0, -200)

tao = turtle.Turtle()
tao.shape(HINH_TAO)
if not TAO_GIF:
    tao.color("red")
tao.penup()
tao.hideturtle()

diem = 0
pen = turtle.Turtle()
pen.hideturtle()
pen.penup()
pen.goto(0, 220)
pen.color("darkgreen" if nen else "black")
pen.write("Điểm: 0", align="center", font=("Arial", 16, "bold"))


def roi_tao():
    x = random.randint(-250, 250)
    tao.showturtle()
    tao.goto(x, 250)
    phat_am("roi.wav")
    tao.sety(-250)


def hung_tao():
    global diem
    if abs(rua.xcor() - tao.xcor()) < NGUONG_VA_CHAM:
        diem += 1
        pen.clear()
        pen.write(f"Điểm: {diem}", align="center", font=("Arial", 16, "bold"))
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
man_hinh.onscreenclick(lambda x, y: hung_tao())

roi_tao()
turtle.done()
