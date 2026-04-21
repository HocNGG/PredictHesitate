## Tài liệu học nhanh: làm EDA trên FE (dễ hiểu)

Mục tiêu: đọc xong là bạn **tự làm được trang phân tích dữ liệu** (Analysis) dựa trên `api.md`, biết **vì sao phải làm như vậy**, và khi đi làm bạn biết **sếp/PM sẽ kiểm tra gì**.

---

## 1) Bài toán EDA là gì?

Trang Analysis hiển thị dữ liệu phân tích theo **model đang được backend dùng hiện tại**.

Backend có 4 API liên quan:

- `GET /eda/price-distribution`: trả về phân bố số lượng mẫu theo khoảng **giá/m²**
- `GET /eda/district-property-type`: trả về **giá trung vị (median)** theo quận/huyện và loại BĐS
- `GET /eda/scatter/version`: trả về **mã run** (run_id) của model đang dùng
- `GET /eda/scatter/file`: trả về **file CSV** (dạng chữ) để vẽ biểu đồ scatter

2 lỗi 404 quan trọng:

- **Chưa có model đang dùng**: `"Chưa có model nào được active. Hãy chạy retrain trước."`
- **Thiếu file scatter**: `"File scatter không tồn tại."` (lúc này chỉ scatter lỗi, chart JSON vẫn chạy được)

---

## 2) Hiểu đúng về `run_id`

### `run_id` là gì?

- `run_id` là **mã của “lần chạy retrain” đang được backend chọn để dùng**.
- Mọi dữ liệu EDA bạn thấy trên FE đều “đi theo” `run_id` này.

### `run_id` đổi khi nào?

`run_id` **có thể đổi** khi:

- retrain xong và backend **chọn model mới làm model đang dùng**
- hoặc backend/admin **chuyển** sang dùng một run khác

`run_id` **có thể không đổi** khi:

- retrain chạy nhưng **không thay model đang dùng** (ví dụ run mới fail/skip, hoặc backend quyết định không thay)
- bạn refresh trang, nhưng backend vẫn dùng model cũ

### Vì sao FE phải quan tâm `run_id`?

- Nếu `run_id` đổi mà FE vẫn dùng dữ liệu cũ → bạn vẽ chart **sai** (dữ liệu của run cũ).
- Nếu `run_id` không đổi mà FE cứ tải CSV lại → **chậm** và **tốn mạng**.

### “Lệch run” là gì?

Ví dụ hiếm nhưng có thật:

- FE gọi `/eda/scatter/version` nhận `run_id=12`
- ngay lúc đó backend đổi run active sang `13`
- FE gọi tiếp `/eda/price-distribution` nhận `run_id=13`

Nếu bạn không kiểm tra, bạn sẽ trộn dữ liệu run 12 và run 13 trong cùng dashboard → nhìn rất khó phát hiện nhưng kết quả sai.

---

## 3) Luồng gọi API EDA đúng (bạn nên thuộc lòng)

### Bước A: gọi version trước

1) Gọi `GET /eda/scatter/version` để lấy `run_id`

### Bước B: xử lý file scatter theo cache

2) Dùng `run_id` để quyết định có tải lại CSV hay không:

- Nếu cache có CSV và `run_id` trùng → dùng cache
- Nếu không trùng → gọi `GET /eda/scatter/file` để tải CSV mới, rồi lưu cache
- Nếu `/eda/scatter/file` lỗi 404 “thiếu file” → đánh dấu scatter “không dùng được” nhưng **không làm sập trang**

### Bước C: gọi 2 API JSON song song

3) Gọi song song:

- `GET /eda/price-distribution`
- `GET /eda/district-property-type`

### Bước D: kiểm tra run_id có bị lệch không

4) So sánh `run_id` của:

- version
- price-distribution
- district-property-type

Nếu lệch → gọi lại cả batch 1 lần (chỉ 1 lần thôi, tránh lặp vô hạn).

---

## 4) Vì sao cần “xử lý dữ liệu” trước khi vẽ chart?

Bạn không nên đưa data thẳng từ API vào chart vì:

- backend có thể trả bins không theo đúng thứ tự
- dữ liệu quận/loại BĐS là danh sách “phẳng”, trong khi chart cần dạng “gom nhóm”
- CSV scatter cần parse cột theo tên, không nên lấy theo số thứ tự cột

Vì vậy FE nên có 1 chỗ riêng để xử lý dữ liệu.

Trong project này, chỗ đó là:

- `src/lib/eda-transform.ts`
  - `sortPriceBins(...)`: sắp xếp bins theo thứ tự chuẩn
  - `groupDistrictPropertyMedianPrice(...)`: gom theo quận → loại BĐS → giá trung vị
  - `parseScatterCsv(...)`: đọc CSV theo tên cột rồi ra danh sách điểm

---

## 5) Cache CSV scatter (để trang nhanh hơn)

Vì CSV có thể nặng, FE lưu vào `localStorage` theo `run_id`.

Trong project này, chỗ đó là:

- `src/lib/eda-cache.ts`
  - `getCachedScatter(runId)`
  - `setCachedScatter(runId, csvText)`

Nguyên tắc nhớ:

- `run_id` đổi → cache cũ bỏ, tải mới
- `run_id` không đổi → dùng cache

---

## 6) UI cần có những trạng thái gì?

Mỗi chart nên có:

- **Đang tải**: hiển thị “Đang tải...”
- **Không có dữ liệu**: hiển thị “Không có dữ liệu”
- **Có dữ liệu**: vẽ chart

Riêng scatter:

- Nếu thiếu file scatter: hiển thị “Không có file scatter” nhưng vẫn vẽ được 2 chart JSON

Trong project này, các chart đã được sửa để nhận data từ props:

- `src/components/charts/price-distribution.tsx`
- `src/components/charts/district-comparison.tsx`
- `src/components/charts/area-vs-price.tsx`

---

## 7) File nào đang làm nhiệm vụ gì? (để bạn đọc code dễ)

- **Gọi API**: `src/api/eda.ts`
- **Lưu cache CSV**: `src/lib/eda-cache.ts`
- **Xử lý dữ liệu trước khi vẽ**: `src/lib/eda-transform.ts`
- **Gọi API + gom state + truyền xuống chart**: `src/pages/AnalysisPage.tsx`

---

## 8) Góc nhìn PM/Sếp: đi làm họ sẽ check bạn biết gì?

### PM check 1: bạn có đọc đúng tài liệu API không?

- đường dẫn API đúng không?
- dữ liệu đúng tên field không? (vd `median_price`, `sample_count`)
- biết chỗ nào là JSON, chỗ nào là CSV

Nhìn vào:

- `src/api/eda.ts`

### PM check 2: bạn có biết sắp xếp dữ liệu trước khi vẽ không?

- bins có được sắp đúng thứ tự không?
- data quận/loại có được gom nhóm không?

Nhìn vào:

- `src/lib/eda-transform.ts`

### PM check 3: bạn có biết làm trang “không bị sập” khi lỗi không?

- 404 chưa có model: hiển thị hướng dẫn
- 404 thiếu scatter: vẫn hiển thị các chart JSON

Nhìn vào:

- `src/pages/AnalysisPage.tsx`
- `src/components/charts/area-vs-price.tsx`

### PM check 4: bạn có biết tối ưu cơ bản không?

- có cache theo `run_id` không?
- có tránh tải CSV lại vô tội vạ không?

Nhìn vào:

- `src/lib/eda-cache.ts`
- `src/pages/AnalysisPage.tsx`

---

## 9) Checklist tự ôn (ngắn gọn)

- [ ] Nắm 4 API EDA + 2 lỗi 404 đặc thù
- [ ] Hiểu `run_id` và vì sao phải kiểm tra “lệch run”
- [ ] Biết cache CSV theo `run_id`
- [ ] Biết sắp bins và gom dữ liệu quận/loại trước khi vẽ
- [ ] UI có trạng thái: đang tải / không có dữ liệu / lỗi / lỗi riêng scatter


