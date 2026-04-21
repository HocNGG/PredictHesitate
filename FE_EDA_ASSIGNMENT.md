## Bài giao: Làm lại luồng EDA (dành cho FE dev)

### Mục tiêu

Em triển khai lại luồng lấy dữ liệu EDA cho trang Analysis để:

- Trang chạy đúng theo `api.md`
- Không trộn dữ liệu giữa các lần retrain (không “lệch run”)
- Tải nhanh (biết cache file scatter theo `run_id`)
- UI không bị sập khi thiếu dữ liệu hoặc lỗi một phần

---

## Phạm vi công việc (phải làm)

### 1) Luồng gọi API (bắt buộc)

Triển khai hàm load dữ liệu theo đúng thứ tự:

1. Gọi `GET /eda/scatter/version` để lấy `run_id`
2. Kiểm tra cache local theo `run_id`
   - Nếu `run_id` trùng cache: dùng CSV đã cache
   - Nếu `run_id` khác: gọi `GET /eda/scatter/file` để tải CSV mới, rồi cache lại
   - Nếu `GET /eda/scatter/file` trả 404 “File scatter không tồn tại.”: chỉ disable phần scatter, các phần JSON vẫn hiển thị
3. Gọi song song:
   - `GET /eda/price-distribution`
   - `GET /eda/district-property-type`
4. Kiểm tra `run_id` giữa các response:
   - Nếu lệch: reload lại batch **tối đa 1 lần** (không loop vô hạn)

### 2) Xử lý dữ liệu trước khi vẽ biểu đồ (bắt buộc)

- **Bins phân bố giá**
  - Không tin thứ tự backend trả về
  - Sắp xếp theo thứ tự label chuẩn:
    - `0-30`, `30-50`, `50-70`, `70-90`, `90-110`, `110-130`, `130+`
- **Quận/huyện x loại BĐS**
  - Backend trả danh sách phẳng `[{district, property_type, median_price, sample_count}]`
  - Em phải “gom nhóm” thành dạng chart dùng được:
    - `{ district: "quận 7", "nhà riêng": 85, "căn hộ chung cư": 55, ... }`
- **CSV scatter**
  - Parse theo **tên cột**, không hard-code index
  - Lấy được tối thiểu 2 cột để vẽ:
    - `diện tích`
    - `giá/m2`

### 3) Trạng thái UI (bắt buộc)

Mỗi biểu đồ cần có:

- **Đang tải**
- **Không có dữ liệu**
- **Lỗi**

Riêng scatter:

- Nếu thiếu file scatter: hiển thị thông báo “Không có file scatter”, nhưng trang vẫn hiển thị các biểu đồ JSON.

---

## Không nằm trong phạm vi (không cần làm)

- Không cần chỉnh style/pixel-perfect UI
- Không cần thêm tính năng mới ngoài spec
- Không cần tối ưu nâng cao (virtualization, web worker, v.v.)
- Không cần đụng tới biểu đồ “Feature Importance” nếu chưa có API tương ứng

---

## Tiêu chí review/chấm (leader sẽ check)

### A) Đúng luồng, đúng dữ liệu

- [ ] Dùng đúng 4 API EDA và đúng đường dẫn `/eda/...`
- [ ] Không trộn dữ liệu khác `run_id` trong 1 lần render
- [ ] Bins được sort theo label chuẩn
- [ ] District-property-type hiển thị theo median_price (không nhầm qua count)
- [ ] CSV parse theo header, không theo vị trí cột

### B) Chịu lỗi tốt

- [ ] 404 “Chưa có model active” → hiển thị hướng dẫn/CTA retrain (hoặc thông báo rõ ràng)
- [ ] 404 “File scatter không tồn tại.” → chỉ scatter lỗi, phần JSON vẫn chạy
- [ ] Network/5xx → có thông báo lỗi + có thể thử tải lại (nếu em có nút retry thì càng tốt)

### C) Code sạch, dễ bảo trì

- [ ] Chỗ gọi API tách khỏi chỗ transform dữ liệu
- [ ] Chart nhận data qua props, không hard-code mock trong chart
- [ ] Không để logic phức tạp trong JSX (tách ra function/useMemo/useEffect hợp lý)

---

## Gợi ý cách test thủ công (em tự check trước khi nộp)

1. Vào trang Analysis:
   - thấy loading rồi hiện chart
2. Tắt backend:
   - thấy lỗi, UI không crash
3. Backend trả 404 “Chưa có model active”:
   - thấy thông báo rõ ràng (gợi ý retrain)
4. Backend trả 404 “File scatter không tồn tại.”:
   - chart scatter báo thiếu file
   - bins + district-type vẫn hiển thị
5. (Nếu có thể) Trigger retrain và chờ active run đổi:
   - refresh Analysis
   - chắc chắn dữ liệu đổi theo run_id mới (cache cũ không còn dùng)

---

## Nộp bài

Khi nộp, gửi:

- Danh sách file đã sửa
- 1–2 ảnh chụp màn hình trang Analysis khi:
  - bình thường (có dữ liệu)
  - scatter bị thiếu file (nếu test được)

