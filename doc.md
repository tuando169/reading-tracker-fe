# ĐẶC TẢ FRONTEND
**Mini Reading Tracker — Trích xuất từ đề bài Fullstack**

> **Phạm vi:** Đặc tả Frontend và hợp đồng API Backend **đề xuất**. API nội bộ không được quy định sẵn trong đề bài; FE và BE cần thống nhất trước khi triển khai.

Phạm vi: Chức năng giao diện, hành vi người dùng, tích hợp Backend và điều kiện nghiệm thu. Nguồn: README.reading-tracker.pdf (4 trang).
## 1. Tổng quan & ràng buộc
| Hạng mục | Yêu cầu từ đề bài |
| --- | --- |
| Framework Frontend | Vue.js |
| Mục tiêu | Tìm sách, lưu vào tủ sách cá nhân, theo dõi tiến độ đọc |
| Màn hình | 3 màn hình; chi tiết sách có thể là trang riêng hoặc modal |
| Người dùng | Một người dùng; không yêu cầu đăng nhập |
| Tích hợp | FE gọi Backend Node.js, không gọi trực tiếp Open Library |
| Thời gian bài test | 3–5 ngày kể từ khi nhận đề |
| Deploy | Frontend, Backend và database đều cần truy cập công khai; HTTPS bắt buộc |

## 2. Danh sách màn hình và chức năng
### 2.1. Màn hình 1 — Tìm kiếm sách (Trang chủ)
- Ô tìm kiếm: hỗ trợ từ khóa theo tên sách hoặc tác giả.
- Kết quả: dạng lưới hoặc danh sách, mỗi sách có ảnh bìa, tên sách, tác giả và năm xuất bản.
- Có phân trang kết quả.
- Sách chưa có trong tủ: hiển thị nút “+ Thêm vào tủ”.
- Sách đã tồn tại trong tủ: hiển thị badge “Đã thêm”.
- Có trạng thái loading, không có kết quả và lỗi.
### 2.2. Màn hình 2 — Chi tiết sách
- Hiển thị ảnh bìa, tên sách, tác giả, mô tả, số trang, chủ đề (subjects), năm xuất bản.
- Cho phép thêm sách vào tủ cá nhân.
- Khi thêm, cho phép chọn trạng thái ban đầu: Muốn đọc / Đang đọc / Đã đọc.
- Có thể triển khai thành route riêng hoặc modal; đề bài không bắt buộc một cách cụ thể.
### 2.3. Màn hình 3 — Tủ sách của tôi
- Có 3 tab lọc trạng thái: Muốn đọc (Chưa đọc) / Đang đọc / Đã đọc; sử dụng enum số `0`, `1`, `2`.
- Hiển thị thống kê nhanh: tổng số sách, số sách đang đọc, số sách đã đọc xong.
- Mỗi sách có thanh tiến độ phần trăm dựa trên số trang đang đọc / tổng số trang.
- Cho phép cập nhật số trang đang đọc và thay đổi trạng thái đọc.
- Cho phép chấm điểm 1–5 sao và nhập ghi chú ngắn.
- Cho phép xóa sách khỏi tủ, có bước xác nhận trước khi xóa.
## 3. Quy tắc nghiệp vụ ảnh hưởng đến FE
| Quy tắc | Hành vi FE cần phản ánh |
| --- | --- |
| Không được thêm trùng sách (Backend trả 409 Conflict) | Nhận và hiển thị lỗi trùng; đồng bộ trạng thái “Đã thêm” sau khi thêm thành công. |
| 0 ≤ số trang đang đọc ≤ tổng số trang | Giới hạn đầu vào và hiển thị thông báo khi dữ liệu không hợp lệ; Backend vẫn là nơi validate. |
| Điểm đánh giá: số nguyên 1–5 hoặc trống | UI chọn sao 1–5, cho phép không đánh giá. |
| Đọc đủ tổng số trang → tự chuyển Đã đọc | Sau khi lưu, cập nhật badge/tab/thống kê và tiến độ theo kết quả từ Backend. |
| Chuyển sang Đang đọc lần đầu → lưu ngày bắt đầu; chuyển sang Đã đọc → lưu ngày hoàn thành | Không tự xác định ngày thay Backend; phản ánh các thay đổi trạng thái được trả về. |
| Backend trả lỗi có format thống nhất và thông báo rõ ràng | Hiển thị thông báo lỗi dễ hiểu tại màn hình liên quan. |

## 4. Danh sách API Backend dành cho Frontend
FE chỉ giao tiếp với Backend Node.js qua `/api` và chỉ biết `bookId`, không nhận hoặc gửi ID của Open Library. Bảng dưới đây là hợp đồng API nội bộ ĐỀ XUẤT để FE và BE thống nhất; đề bài gốc không chỉ định endpoint backend. Backend tự tích hợp Open Library và lưu dữ liệu tủ sách trong MySQL.
| Chức năng FE | API Backend đề xuất | Request (ví dụ) | Response thành công (ví dụ) |
| --- | --- | --- | --- |
| Tìm sách theo từ khóa, phân trang | `GET /api/books` | Query: `?query=harry&page=1&limit=20` | `200` — `{"data":[{"bookId":12,"title":"Harry Potter","author":"J. K. Rowling","firstPublishYear":1997,"coverUrl":"/api/books/12/cover?size=M","isInLibrary":false}],"meta":{"page":1,"limit":20,"total":120,"totalPages":6}}` |
| Xem chi tiết sách | `GET /api/books/:bookId` | Path: `bookId=12`; không có body | `200` — `{"data":{"bookId":12,"title":"Harry Potter","author":"J. K. Rowling","description":"Mô tả sách...","subjects":["Fantasy"],"firstPublishYear":1997,"totalPages":300,"coverUrl":"/api/books/12/cover?size=M","isInLibrary":false}}` |
| Lấy ảnh bìa qua Backend | `GET /api/books/:bookId/cover` | Path: `bookId=12`; query: `?size=M` | `200` — dữ liệu ảnh nhị phân (`Content-Type: image/jpeg`); không trả JSON |
| Danh sách sách trong tủ, lọc trạng thái | `GET /api/library` | Query tùy chọn: `?status=1` (enum số: `0`, `1`, `2`); không có body | `200` — `{"data":[{"bookId":12,"title":"Harry Potter","author":"J. K. Rowling","coverUrl":"/api/books/12/cover?size=M","status":1,"currentPage":120,"totalPages":300,"progressPercent":40,"rating":null,"note":""}]}` |
| Thống kê tủ sách | `GET /api/library/stats` | Không có query/body bắt buộc | `200` — `{"data":{"totalBooks":8,"readingBooks":3,"finishedBooks":2}}` |
| Xem chi tiết sách đã lưu | `GET /api/library/:bookId` | Path: `bookId=12`; không có body | `200` — `{"data":{"bookId":12,"title":"Harry Potter","status":1,"currentPage":120,"totalPages":300,"progressPercent":40,"rating":5,"note":"Hay","startedAt":"2026-10-01T10:00:00Z","finishedAt":null}}` |
| Thêm sách vào tủ; chọn trạng thái ban đầu | `POST /api/library` | JSON body: `{"bookId":12,"status":0}` | `201` — `{"data":{"bookId":12,"status":0,"currentPage":0,"totalPages":300,"progressPercent":0,"rating":null,"note":"","startedAt":null,"finishedAt":null}}` |
| Cập nhật trạng thái / số trang / đánh giá / ghi chú | `PATCH /api/library/:bookId` | Path: `bookId=12`; JSON body (gửi các trường cần đổi): `{"status":1,"currentPage":120,"rating":5,"note":"Rất hay"}` | `200` — `{"data":{"bookId":12,"status":1,"currentPage":120,"totalPages":300,"progressPercent":40,"rating":5,"note":"Rất hay","startedAt":"2026-10-18T02:00:00Z","finishedAt":null}}` |
| Xóa sách khỏi tủ | `DELETE /api/library/:bookId` | Path: `bookId=12`; không có body | `204 No Content` — không có response body |

> **Ghi chú:** Request/Response trong bảng là **hợp đồng API đề xuất**, không phải dữ liệu hoặc endpoint Backend đã triển khai. Các giá trị như số lượng sách, ngày giờ, tác giả và số trang chỉ nhằm minh họa. `bookId` luôn là ID do Backend cung cấp; FE không cần biết mã Open Library.

**Quy ước lỗi đề xuất:** `400/422` khi tham số hoặc dữ liệu không hợp lệ; `404` khi không tìm thấy sách; `409` khi thêm sách đã có trong tủ; `500` khi lỗi máy chủ. Response lỗi thống nhất, ví dụ: `{"error":{"code":"BOOK_ALREADY_EXISTS","message":"Sách đã có trong tủ"}}`. Khi BE trả về `currentPage = totalPages`, trạng thái trong response phải là `2` (Đọc xong) theo quy tắc nghiệp vụ. Nếu sách không có ảnh bìa, BE cần thống nhất cách trả `404` hoặc ảnh mặc định để FE xử lý.

Quy ước đề xuất: base URL = {VITE_API_URL}/api. **FE chỉ sử dụng `bookId`** làm định danh sách trong tất cả API và payload; Backend chịu trách nhiệm ánh xạ `bookId` nội bộ sang mã tác phẩm/ấn bản của Open Library (nếu cần). Để `bookId` dùng được ngay ở kết quả tìm kiếm, Backend phải cấp và duy trì `bookId` ổn định cho mỗi sách trước cả khi người dùng thêm vào tủ; không được tạo một ID mới chỉ khi thêm sách. Có thể dùng bảng danh mục `books` và bảng quan hệ/tủ sách `library_books` trong MySQL. Nếu Backend định nghĩa cách định danh khác, hai bên cần thống nhất nhưng tên field giao tiếp với FE vẫn là `bookId`.

Dữ liệu trả về nên nhất quán, ví dụ `{ data, meta }` với danh sách, `{ data }` với chi tiết; lỗi `{ error: { code, message, details? } }`. FE hiển thị thông báo từ BE, đặc biệt `409 Conflict` khi thêm trùng và `400/422` khi nhập sai. Đây là thiết kế đề xuất, không phải API đã được đề bài quy định.
### 4.1. Enum trạng thái đọc (thống nhất FE–BE)

Trường `status` **chỉ nhận một trong ba giá trị enum dạng số**, truyền kiểu **number** (`0`, `1`, `2`) trong request/response, không truyền chuỗi:

```ts
export enum ReadingStatus {
  NOT_READ = 0, // Chưa đọc (Muốn đọc)
  READING = 1,  // Đang đọc
  FINISHED = 2, // Đọc xong
}
```

| Enum (`status`) | Nhãn hiển thị trên FE | Ý nghĩa |
| --- | --- | --- |
| `0` (`NOT_READ`) | Chưa đọc / Muốn đọc | Sách chưa bắt đầu đọc |
| `1` (`READING`) | Đang đọc | Sách đang được đọc |
| `2` (`FINISHED`) | Đọc xong / Đã đọc | Sách đã hoàn thành |

- FE dùng **giá trị enum** trong bộ lọc `GET /api/library?status=...`, request `POST /api/library`, `PATCH /api/library/:bookId` và trong mọi response chứa `status`.
- FE chuyển giá trị số thành nhãn tiếng Việt để hiển thị; **Backend cũng phải validate enum**. Giá trị ngoài danh sách trả `400` hoặc `422` theo quy ước lỗi.
- Khi `currentPage === totalPages` (với `totalPages > 0`), Backend tự trả về `status: 2` theo yêu cầu đề bài; FE cập nhật badge, tab và thống kê theo response.
- Khi chuyển sang `1` (`READING`) lần đầu, BE ghi `startedAt`; khi chuyển sang `2` (`FINISHED`), BE ghi `finishedAt`.
- Đề bài chỉ quy định ba trạng thái **Muốn đọc / Đang đọc / Đã đọc** bằng ngôn ngữ tự nhiên, không chỉ định mã enum; tên `0`, `1`, `2` là quy ước API đề xuất.

Payload thêm sách ví dụ (giả định sách đã được BE trả về với `bookId: 12` khi tìm kiếm): POST /api/library với {"bookId":12,"status":0}. Response ví dụ: 201 Created, {"data":{"bookId":12,"status":0,"currentPage":0,"totalPages":300}}.
Payload tiến độ ví dụ: PATCH /api/library/12 với {"currentPage":120}. Backend xác thực 0 ≤ currentPage ≤ totalPages và tự cập nhật `status = 2` khi đọc đủ số trang. FE cập nhật màn hình theo response.
Payload đánh giá/ghi chú ví dụ: PATCH /api/library/12 với {"rating":5,"note":"Rất cuốn hút"}. rating cho phép 1–5 hoặc null; note có thể để trống.
Thông tin FE cần từ response: bookId, title, author, firstPublishYear, coverUrl, description, subjects, totalPages, currentPage, progressPercent, status, rating, note, startedAt, finishedAt, isInLibrary. Các trường thực tế do Backend mapping; dữ liệu Open Library có thể thiếu.
Lưu ý: Không có API đọc toàn văn sách vì đề bài không yêu cầu tính năng ebook reader. Mọi ảnh bìa được tải qua Backend nếu tuân thủ yêu cầu mọi request Open Library phải đi qua Backend.
## 5. Trạng thái và luồng giao diện cần xử lý
| Luồng | Kết quả mong đợi |
| --- | --- |
| Tìm sách | Nhập từ khóa → tải kết quả → xem lưới/danh sách → chuyển trang. |
| Thêm sách | Mở chi tiết hoặc thao tác thêm → chọn trạng thái ban đầu nếu cần → lưu → hiển thị “Đã thêm”. |
| Theo dõi đọc | Mở tủ sách → chọn tab → cập nhật trang đọc/trạng thái → thanh tiến độ và thống kê cập nhật. |
| Đánh giá | Chọn 1–5 sao hoặc để trống; nhập ghi chú và lưu. |
| Xóa | Bấm xóa → hộp thoại xác nhận → xóa hoặc hủy. |
| Thất bại | Phản ánh loading, lỗi từ Backend, không có dữ liệu theo từng màn hình. |

## 6. Checklist FE trước khi hoàn thành
- [ ] Đủ 3 màn hình hoặc 2 route + modal chi tiết; Vue.js.
- [ ] Tìm theo tên/tác giả; hiển thị ảnh bìa, tên, tác giả, năm và phân trang.
- [ ] Loading, không có kết quả và lỗi tìm kiếm.
- [ ] Trạng thái nút thêm sách và badge “Đã thêm” chính xác.
- [ ] Chi tiết có mô tả, số trang, subjects, năm; chọn trạng thái khi thêm.
- [ ] Tủ sách có 3 tab, 3 thống kê và tiến độ %.
- [ ] Cập nhật số trang, trạng thái, đánh giá 1–5 sao, ghi chú.
- [ ] Xóa có xác nhận; xử lý lỗi 409, lỗi validate và cập nhật dữ liệu sau lưu.
- [ ] Không gọi trực tiếp Open Library; sử dụng Backend API.
- [ ] Deploy HTTPS public; có dữ liệu mẫu và tài liệu bàn giao.
