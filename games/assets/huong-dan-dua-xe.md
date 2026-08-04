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

## 5. Bài tập mở rộng (sau khi chạy được game cơ bản)

| Bài | Nội dung | Độ khó |
|-----|----------|--------|
| 1 | Sơ đồ né / tông | Dễ |
| 2 | Tăng `toc_do` theo điểm | Trung bình |
| 3 | **Level** — mỗi 100 điểm lên cấp, spawn dày hơn | Trung bình |
| 4 | **Thời gian sống** — đếm giây trên bảng | Trung bình |
| 5 | **Đếm ngược 60s** — hết giờ = THẮNG | Khó |
| 6 | **3 mạng** — tông chưa thua ngay | Khó |
| 7 | Lưu điểm cao (`diem_cao.txt`) | Trung bình |
| 8 | Mini dự án: Level + thời gian + tốc độ | Khó |

Chi tiết từng bài xem trên website: **Bài học Đua xe → mục Bài tập**.

### Gợi ý biến mới

```python
toc_do = 6
level = 1
giay = 0          # thời gian sống (đếm xuôi)
thoi_gian = 60    # đếm ngược (bài 5)
mang = 3          # mạng sống (bài 6)
```

Khi lên level / hết giờ / mất mạng — nhớ cập nhật `ve_bang()` để học sinh thấy rõ trên màn hình.

