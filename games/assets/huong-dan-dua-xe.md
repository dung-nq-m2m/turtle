# Hướng dẫn hình ảnh & âm thanh — Game Đua xe 🏎️

← [Tổng quan Chương 6](HUONG-DAN-CHUONG-6.md) · Trước: [Mê cung](huong-dan-me-cung.md) · Tiếp: [Bắn bóng](huong-dan-ban-bong.md)

Dành cho học sinh lớp 6 · Học viện Turtle Python

## Logic quan trọng (đã review)

1. **3 làn** — `LAN_XE = [-100, 0, 100]`
2. **Không chồng xe** — `lan_co_xe(lan)` kiểm tra trước khi `tao_xe_doi()`
3. **Va chạm chữ nhật** — `cham_xe()` dùng `abs()` ngang/dọc (không `distance()`)
4. **Điểm** — mỗi xe vượt qua màn hình `+10` (hiển thị `Điểm: …`)

## 1. Cấu trúc thư mục

```
games/
├── dua-xe.py
├── nen-duong.gif   ← nền đường (tùy chọn)
├── xe-em.gif       ← xe người chơi (tùy chọn)
├── xe-doi.gif      ← xe đối thủ (tùy chọn)
└── tong.wav        ← tiếng tông xe (tùy chọn)
```

**Lưu ý:** File ảnh/âm đặt **cùng thư mục** với `dua-xe.py`.

Chưa có file → nền xám, xe square xanh / đỏ-cam-tím.

## 2. Chạy thử

```bash
cd games
python dua-xe.py
```

Phím: **← →** đổi làn · Né xe đối thủ · Mỗi xe vượt qua = +10 điểm!
