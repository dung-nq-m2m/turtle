# Hướng dẫn hình ảnh & âm thanh — Game Hứng táo 🍎

← [Tổng quan Chương 6](HUONG-DAN-CHUONG-6.md) · Tiếp: [Né bom](huong-dan-ne-bom.md)

Dành cho học sinh lớp 6 · Học viện Turtle Python

## 1. Cấu trúc thư mục

```
games/
├── hung-tao.py
└── assets/
    ├── images/
    │   ├── nen-vuon.gif    ← hình nền (tùy chọn)
    │   └── tao.gif         ← hình quả táo (tùy chọn)
    └── sounds/
        ├── hung.wav        ← tiếng hứng trúng
        ├── roi.wav         ← tiếng táo xuất hiện
        └── gameover.wav    ← thua (mở rộng)
```

Chưa có file → game chạy với nền xanh, táo đỏ vẽ sẵn, không tiếng.

---

## 2. Hình nền (`nen-vuon.gif`)

| Yêu cầu | Chi tiết |
|---------|----------|
| Định dạng | **GIF** (không JPG/PNG) |
| Kích thước | **600×500** px |
| Nội dung | Cỏ, bầu trời, vườn |

```python
man_hinh.bgpic("assets/images/nen-vuon.gif")
```

**Chuẩn bị:** Tải/vẽ ảnh → resize 600×500 → Save as `.gif` → đặt vào `assets/images/`.

---

## 3. Hình quả táo

### Cách A — File GIF

```python
man_hinh.addshape("assets/images/tao.gif")
tao.shape("assets/images/tao.gif")
```

Kích thước **32–64** px, nền trong suốt.

### Cách B — `register_shape()` (code mẫu đã có)

```python
man_hinh.register_shape("tao_ve", ((0, 20), (8, 10), ...))
tao.shape("tao_ve")
tao.color("red")
```

**Va chạm:** táo to hơn → tăng `NGUONG_VA_CHAM` (40 → 50–60).

---

## 4. Âm thanh

| File | Khi phát |
|------|----------|
| `hung.wav` | Hứng trúng |
| `roi.wav` | Táo mới |
| `gameover.wav` | Thua (mở rộng) |

```python
winsound.PlaySound(path, winsound.SND_ASYNC)
```

Chỉ dùng **WAV**, độ dài 0.2–1 giây. Xem quy tắc chung tại [HUONG-DAN-CHUONG-6.md](HUONG-DAN-CHUONG-6.md).

---

## 5. Quy trình làm bài

1. Chạy game không ảnh/âm — hiểu logic.
2. Thêm hình táo (GIF hoặc `register_shape`).
3. Thêm nền GIF.
4. Thêm `hung.wav` khi hứng trúng.

---

## 6. Chạy thử

```bash
cd games
python hung-tao.py
```

Phím: **← →** · **Space** / **click** để hứng.
