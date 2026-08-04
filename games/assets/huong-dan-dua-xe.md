# Hướng dẫn hình ảnh & âm thanh — Game Đua xe 🏎️

← [Tổng quan Chương 6](HUONG-DAN-CHUONG-6.md) · Trước: [Mê cung](huong-dan-me-cung.md) · Tiếp: [Bắn bóng](huong-dan-ban-bong.md)

Dành cho học sinh lớp 6 · Học viện Turtle Python

## Logic quan trọng

1. **3 làn** — `LAN_XE = [-100, 0, 100]`
2. **Không chồng xe** — `lan_co_xe(lan)` kiểm tra trước khi `tao_xe_doi()`
3. **Va chạm chữ nhật** — `cham_xe()` dùng `abs()` ngang/dọc (xe GIF ≈ 40×60)
4. **Điểm** — mỗi xe vượt qua màn hình `+10`

## 1. Hình ô tô — đã tạo sẵn ✅

Đặt cạnh `dua-xe.py` (đã có trong thư mục `games/`):

| File | Mô tả |
|------|--------|
| `xe-em.gif` | Xe người chơi — **xanh dương**, nhìn từ trên xuống |
| `xe-doi.gif` | Xe đối thủ — **đỏ** |
| `xe-doi-cam.gif` | Xe đối thủ — **cam** |
| `xe-doi-tim.gif` | Xe đối thủ — **tím** |

Kích thước mỗi xe: **40×60** px · nền trong suốt · định dạng **GIF** (turtle yêu cầu).

Code tự `addshape()` khi tìm thấy file. Không có file → dùng `square` như cũ.

### Tạo lại hình (nếu cần)

```bash
cd games
python _make_car_gifs.py
```

## 2. File tùy chọn thêm

```
games/
├── dua-xe.py
├── xe-em.gif        ✅ sẵn
├── xe-doi.gif       ✅ sẵn
├── xe-doi-cam.gif   ✅ sẵn
├── xe-doi-tim.gif   ✅ sẵn
├── nen-duong.gif    ← nền đường (tùy chọn, 400×600)
└── tong.wav         ← tiếng tông xe (tùy chọn)
```

## 3. Cách dùng trong code

```python
man_hinh.addshape("xe-em.gif")
xe_em.shape("xe-em.gif")

man_hinh.addshape("xe-doi.gif")
xe.shape("xe-doi.gif")
```

## 4. Chạy thử

```bash
cd games
python dua-xe.py
```

Phím: **← →** đổi làn · Né xe đối thủ · Mỗi xe vượt qua = +10 điểm!
