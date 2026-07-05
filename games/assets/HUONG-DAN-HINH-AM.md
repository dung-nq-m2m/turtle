# Hướng dẫn hình ảnh & âm thanh — Game Hứng táo

Dành cho học sinh lớp 6 · Học viện Turtle Python

## 1. Cấu trúc thư mục

Đặt file vào đúng chỗ để code tự tìm:

```
games/
├── hung-tao.py
└── assets/
    ├── images/
    │   ├── nen-vuon.gif    ← hình nền (tùy chọn)
    │   └── tao.gif         ← hình quả táo (tùy chọn)
    └── sounds/
        ├── hung.wav        ← tiếng hứng trúng (tùy chọn)
        ├── roi.wav         ← tiếng táo rơi (tùy chọn)
        └── gameover.wav    ← tiếng thua (tùy chọn)
```

Nếu **chưa có file**, game vẫn chạy bình thường (nền xanh, táo hình tròn đỏ, không có tiếng).

---

## 2. Hình nền (`nen-vuon.gif`)

### Quy tắc quan trọng

| Yêu cầu | Giải thích |
|---------|------------|
| **Định dạng GIF** | Thư viện `turtle` chỉ dùng được **GIF** cho `bgpic()`, không dùng JPG/PNG trực tiếp |
| **Kích thước** | Nên **600×500** px (khớp `setup(600, 500)`) hoặc tỉ lệ gần 6:5 |
| **Nội dung** | Cỏ, bầu trời, vườn cây — tránh chi tiết quá nhỏ |

### Cách thêm vào code

```python
man_hinh.bgpic("assets/images/nen-vuon.gif")
```

### Chuẩn bị hình nền

1. Tìm ảnh miễn phí (vườn, bầu trời) hoặc vẽ bằng Paint.
2. Cắt/resize về **600×500** px.
3. **Lưu thành GIF**: File → Save as → chọn `.gif`
   - Hoặc dùng trang đổi PNG → GIF (tìm "convert png to gif").
4. Đặt tên `nen-vuon.gif` vào `games/assets/images/`.

### Lưu ý

- Ảnh GIF có nhiều màu sẽ nặng; nền đơn giản chạy mượt hơn.
- Nếu nền bị méo, chỉnh lại kích thước ảnh cho khớp cửa sổ game.

---

## 3. Hình quả táo (`tao.gif`)

Có **2 cách** — chọn một:

### Cách A — Dùng file GIF (đẹp hơn)

```python
man_hinh.addshape("assets/images/tao.gif")
tao.shape("assets/images/tao.gif")
```

| Yêu cầu | Gợi ý |
|---------|-------|
| Định dạng | **GIF** (có nền trong suốt càng tốt) |
| Kích thước | **32×32** đến **64×64** px |
| Hình dạng | Quả táo đỏ, nhìn rõ khi rơi |

**Các bước:**

1. Tìm icon táo PNG (hoặc vẽ hình tròn + cuống lá).
2. Resize nhỏ (khoảng 48×48).
3. Đổi sang GIF, lưu `tao.gif`.
4. Copy vào `games/assets/images/`.

### Cách B — Vẽ bằng `register_shape()` (không cần file)

Dùng tọa độ đa giác — phù hợp khi chưa có ảnh:

```python
hinh_tao = (
    (0, 20), (8, 10), (10, 0), (8, -12), (0, -18),
    (-8, -12), (-10, 0), (-8, 10)
)
man_hinh.register_shape("tao_ve", hinh_tao)
tao.shape("tao_ve")
tao.color("red")
```

Code mẫu `hung-tao.py` đã có sẵn hình vẽ này khi không tìm thấy `tao.gif`.

### Va chạm khi đổi hình

Táo to hơn → tăng ngưỡng va chạm:

```python
NGUONG = 50   # thử 40, 50, 60 tùy kích thước hình
if abs(rua.xcor() - tao.xcor()) < NGUONG:
```

---

## 4. Âm thanh (Windows — `winsound`)

Python trên Windows có sẵn `winsound`, **chỉ phát file WAV** (không phát MP3 trực tiếp).

### File âm thanh gợi ý

| File | Khi nào phát | Gợi ý |
|------|--------------|-------|
| `hung.wav` | Hứng trúng táo | Tiếng "ting", "pop" ngắn |
| `roi.wav` | Táo mới xuất hiện | Tiếng "whoosh" nhẹ |
| `gameover.wav` | Thua (mở rộng) | Tiếng buồn ngắn |

### Quy tắc file WAV

- Định dạng: **.wav** (PCM)
- Độ dài: **0.2 – 1 giây** (ngắn, game không bị chậm)
- Đặt trong `games/assets/sounds/`

### Code phát âm thanh

```python
import winsound

def phat_am(ten_file):
    duong_dan = f"assets/sounds/{ten_file}"
    if os.path.isfile(duong_dan):
        winsound.PlaySound(duong_dan, winsound.SND_ASYNC)
```

- `SND_ASYNC`: phát **không chặn** game (táo vẫn rơi được).
- Gọi trong `hung_tao()` khi cộng điểm: `phat_am("hung.wav")`

### Lấy file âm thanh ở đâu?

1. [freesound.org](https://freesound.org) — tìm "pop", "coin", "catch" → tải WAV.
2. Ghi âm bằng điện thoại → chuyển sang WAV (ứng dụng hoặc trang convert).
3. Windows: một số file trong `C:\Windows\Media\` (dùng có bản quyền trong lớp).

### Mac / Linux

`winsound` không có trên Mac. Có thể bỏ qua âm thanh hoặc cài `playsound` / `pygame` (nâng cao).

---

## 5. Quy trình làm bài (gợi ý cho GV)

1. Học sinh chạy game **không ảnh/âm** — hiểu logic trước.
2. Thêm **hình táo** (cách B hoặc GIF).
3. Thêm **hình nền** GIF.
4. Thêm **1 âm thanh** `hung.wav` khi hứng trúng.
5. (Mở rộng) Thêm `gameover.wav` khi táo chạm đất.

---

## 6. Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `couldn't open "...gif"` | Sai đường dẫn hoặc không phải GIF | Kiểm tra tên file, chạy `hung-tao.py` từ thư mục `games/` |
| Nền không hiện | Dùng JPG/PNG | Đổi sang GIF |
| Táo quá to/nhỏ | Sai kích thước GIF | Resize ảnh, chỉnh `NGUONG` va chạm |
| Không có tiếng | File MP3 hoặc sai tên | Đổi sang `.wav`, đúng tên trong `sounds/` |
| Chạy từ IDLE sai thư mục | `os.getcwd()` khác | Code mẫu dùng `__file__` để tìm assets |

---

## 7. Chạy thử

```bash
cd games
python hung-tao.py
```

Phím: **← →** di chuyển · **Space** hoặc **click** để hứng.
