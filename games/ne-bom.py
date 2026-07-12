"""
Game: Né bom 💣
Học viện Turtle Python - Lớp 6

Phím ← → di chuyển, tránh bom rơi

Âm thanh (tùy chọn, Windows):
  assets/ne-bom/sounds/nhac-nen.wav  — nhạc nền lặp
  assets/ne-bom/sounds/no.wav        — GAME OVER

Xem: assets/huong-dan-ne-bom.md
"""
import os
import random
import time
import turtle

THU_MUC = os.path.dirname(os.path.abspath(__file__))
SND = os.path.join(THU_MUC, "assets", "ne-bom", "sounds")


def co_am(ten_file):
    path = os.path.join(SND, ten_file)
    return path if os.path.isfile(path) else None


try:
    import winsound

    def phat_nhac_nen():
        path = co_am("nhac-nen.wav")
        if path:
            winsound.PlaySound(path, winsound.SND_ASYNC | winsound.SND_LOOP)

    def dung_nhac_nen():
        winsound.PlaySound(None, winsound.SND_PURGE)

    def phat_am(ten_file):
        path = co_am(ten_file)
        if path:
            winsound.PlaySound(path, winsound.SND_ASYNC)
except ImportError:
    def phat_nhac_nen():
        pass

    def dung_nhac_nen():
        pass

    def phat_am(ten_file):
        pass


screen = turtle.Screen()
screen.setup(600, 600)
screen.title("Né Bom 💣")
screen.bgcolor("black")
screen.tracer(0)

player = turtle.Turtle()
player.shape("turtle")
player.color("lime")
player.penup()
player.goto(0, -250)

score = 0
game_running = True

score_writer = turtle.Turtle()
score_writer.hideturtle()
score_writer.color("white")
score_writer.penup()
score_writer.goto(0, 260)

game_over_writer = turtle.Turtle()
game_over_writer.hideturtle()
game_over_writer.color("yellow")
game_over_writer.penup()

danh_sach_bom = []

for x in range(3):
    bomb = turtle.Turtle()
    bomb.shape("circle")
    bomb.color("red")
    bomb.penup()

    danh_sach_bom.append({
        "obj": bomb,
        "speed": random.randint(6, 12)
    })


def update_score():
    score_writer.clear()
    score_writer.write(
        f"Điểm: {score}",
        align="center",
        font=("Arial", 16, "bold")
    )


def reset_bom():
    for item in danh_sach_bom:
        item["obj"].goto(
            random.randint(-270, 270),
            random.randint(280, 500)
        )


def game_over():
    dung_nhac_nen()
    phat_am("no.wav")
    game_over_writer.goto(0, 0)
    game_over_writer.write(
        f"GAME OVER\nĐiểm: {score}",
        align="center",
        font=("Arial", 24, "bold")
    )


def move_left():
    x = player.xcor() - 30
    if x < -280:
        x = -280
    player.setx(x)


def move_right():
    x = player.xcor() + 30
    if x > 280:
        x = 280
    player.setx(x)


screen.listen()
screen.onkeypress(move_left, "Left")
screen.onkeypress(move_right, "Right")

update_score()
reset_bom()
phat_nhac_nen()

while True:
    screen.update()
    if not game_running:
        break

    for item in danh_sach_bom:
        bomb = item["obj"]
        speed = item["speed"]
        bomb.sety(bomb.ycor() - speed)
        if bomb.ycor() < -320:
            score += 1
            update_score()
            bomb.goto(
                random.randint(-270, 270),
                random.randint(320, 500)
            )
            item["speed"] = random.randint(6, 12)

        if bomb.distance(player) < 25:
            game_running = False
            game_over()
            screen.update()
            break
    time.sleep(0.00001)

turtle.done()
