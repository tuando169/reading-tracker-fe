# TÀI LIỆU TRIỂN KHAI DỰ ÁN FRONTEND
## Mini Reading Tracker (Vue.js 3 + TypeScript)

> **Căn cứ tài liệu:** Trích xuất và đặc tả chi tiết từ `doc.md` (Đặc tả Frontend & Hợp đồng API đề xuất).  
> **Mục tiêu tài liệu:** Cung cấp bản thiết kế kỹ thuật, kiến trúc thư mục, mô hình dữ liệu, lộ trình thực hiện theo ngày và hướng dẫn triển khai thực tế cho dự án Frontend mới.

---

## MỤC LỤC
1. [Tổng quan dự án & Ràng buộc kỹ thuật](#1-tổng-quan-dự-án--ràng-buộc-kỹ-thuật)
2. [Lựa chọn Tech Stack & Công cụ](#2-lựa-chọn-tech-stack--công-cụ)
3. [Cấu trúc thư mục dự án (Folder Structure)](#3-cấu-trúc-thư-mục-dự-án-folder-structure)
4. [Mô hình Dữ liệu & Type Definitions (TypeScript)](#4-mô-hình-dữ-liệu--type-definitions-typescript)
5. [Thiết kế Routing & Quản lý trạng thái (State Management)](#5-thiết-kế-routing--quản-lý-trạng-thái-state-management)
6. [Tầng Tích hợp API (API Service Layer) & Xử lý lỗi](#6-tầng-tích-hợp-api-api-service-layer--xử-lý-lỗi)
7. [Chi tiết Triển khai Giao diện & Component (UI/UX)](#7-chi-tiết-triển-khai-giao-diện--component-uiux)
8. [Quy tắc Nghiệp vụ Frontend (Business Logic Rules)](#8-quy-tắc-nghiệp-vụ-frontend-business-logic-rules)
9. [Lộ trình Triển khai Chi tiết (Các bước thực hiện)](#9-lộ-trình-triển-khai-chi-tiết-các-bước-thực-hiện)
10. [Checklist Nghiệm thu Chất lượng (QA & Delivery)](#10-checklist-nghiệm-thu-chất-lượng-qa--delivery)

---

## 1. TỔNG QUAN DỰ ÁN & RÀNG BUỘC KỸ THUẬT

### 1.1. Mục tiêu
Xây dựng ứng dụng web **Mini Reading Tracker** cho phép một người dùng cá nhân:
- Tìm kiếm sách qua kho dữ liệu (thông qua Backend Node.js).
- Xem thông tin chi tiết của sách.
- Lưu sách vào tủ sách cá nhân theo trạng thái đọc (Muốn đọc / Đang đọc / Đã đọc).
- Cập nhật số trang đã đọc, thanh tiến độ %, chấm điểm 1–5 sao, ghi chú và xóa sách.
- Xem bảng thống kê nhanh về tiến trình đọc cá nhân.

### 1.2. Các ràng buộc bắt buộc (Non-negotiable constraints)
- **Framework:** Vue.js (khuyến nghị **Vue 3 Composition API** + `<script setup>`).
- **Phạm vi người dùng:** Single-user, không yêu cầu xác thực / đăng nhập.
- **Tích hợp mạng:** FE chỉ giao tiếp với Backend Node.js qua tiền tố `/api`, **tuyệt đối không gọi trực tiếp API Open Library**.
- **Định danh sách:** FE chỉ quản lý và gửi nhận `bookId` nội bộ do Backend cấp.
- **Ảnh bìa:** Tải thông qua endpoint proxy của Backend (`GET /api/books/:bookId/cover?size=M`).
- **Thời hạn hoàn thành:** 3 – 5 ngày.
- **Môi trường triển khai:** Public Hosting với giao thức **HTTPS bắt buộc**.

---

## 2. LỰA CHỌN TECH STACK & CÔNG CỤ

| Thành phần | Công nghệ lựa chọn | Lý do / Vai trò |
| :--- | :--- | :--- |
| **Core Framework** | **Vue 3** (`vue@^3.4`) | Ràng buộc đề bài, tối ưu hiệu năng với Composition API |
| **Build Tool** | **Vite** (`vite@^5.x`) | Khởi động cực nhanh, HMR tức thì, cấu hình chuẩn |
| **Ngôn ngữ** | **TypeScript** (`typescript@^5.x`) | Đảm bảo tính chặt chẽ của kiểu dữ liệu, bắt lỗi sớm lúc compile |
| **Routing** | **Vue Router 4** (`vue-router@^4.x`) | Quản lý điều hướng 3 màn hình, hỗ trợ query params cho search & filter |
| **State Management**| **Pinia** (`pinia@^2.x`) | Quản lý state tập trung cho Tủ sách (Library), Danh mục tìm kiếm và Toast UI |
| **HTTP Client** | **Axios** (`axios@^1.7`) | Quản lý interceptors bắt lỗi tập trung (400, 404, 409, 500) |
| **Styling** | **Tailwind CSS** (`tailwindcss@^3.4`, `postcss`, `autoprefixer`) | Xây dựng UI hiện đại, responsive mobile/desktop, utility-first sạch đẹp |
| **Icons** | **Lucide-vue-next** (hoặc `@heroicons/vue`) | Bộ icon nhẹ, hiện đại cho Star rating, Search, Book, Trash, Loading |

---

## 3. CẤU TRÚC THƯ MỤC DỰ ÁN (FOLDER STRUCTURE)

Thiết kế cấu trúc dự án theo hướng **Layered + Feature-based** rõ ràng, dễ bảo trì:

```text
reading-tracker-fe/
├── public/
│   ├── favicon.ico
│   └── placeholder-cover.svg     # Ảnh fallback khi sách không có bìa
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css          # Global CSS, CSS variables, typography
│   │   │   └── reset.css
│   ├── components/               # Components Layout / Toàn cục
│   │   ├── AppHeader.vue         # Navbar điều hướng (Trang chủ / Tủ sách)
│   │   └── ToastContainer.vue    # Khung hiển thị thông báo góc màn hình
│   ├── pages/                    # Các trang và component riêng của từng trang
│   │   ├── search/               # Màn hình 1: Tìm kiếm sách (Trang chủ)
│   │   │   ├── BookSearchPage.vue
│   │   │   └── components/
│   │   │       ├── BookCard.vue          # Thẻ sách ở danh sách tìm kiếm
│   │   │       ├── BookSearchInput.vue   # Ô tìm kiếm sách có Debounce
│   │   │       ├── BookDetailModal.vue   # Modal xem chi tiết sách
│   │   │       ├── AddToLibraryModal.vue # Modal chọn trạng thái khi thêm vào tủ
│   │   │       ├── SearchPagination.vue  # Phân trang kết quả tìm kiếm
│   │   │       ├── SearchSkeleton.vue    # Loading skeleton khi đang tìm kiếm
│   │   │       └── SearchEmptyState.vue  # Trạng thái không có kết quả
│   │   └── library/              # Màn hình 3: Tủ sách của tôi
│   │       ├── MyLibraryPage.vue
│   │       └── components/
│   │           ├── LibraryStatsHeader.vue # 3 thẻ thống kê (Tổng, Đang đọc, Đã đọc)
│   │           ├── LibraryFilterTabs.vue  # 3 tab chuyển trạng thái (0, 1, 2)
│   │           ├── LibraryBookCard.vue    # Thẻ sách trong tủ (tiến độ, nút sửa/xóa)
│   │           ├── ProgressBar.vue        # Thanh hiển thị % tiến độ đọc
│   │           ├── StarRating.vue         # Component chọn và hiển thị 1-5 sao
│   │           ├── UpdateProgressModal.vue# Modal cập nhật trang đọc & trạng thái
│   │           ├── RatingModal.vue        # Modal đánh giá & ghi chú
│   │           └── ConfirmDeleteModal.vue # Hộp thoại xác nhận xóa sách
│   ├── composables/              # Custom composables
│   │   ├── useDebounce.ts        # Hỗ trợ tìm kiếm debounce tránh spam API
│   │   ├── useToast.ts           # Trigger thông báo nổi (success, error)
│   │   └── useBookStatus.ts      # Chuyển đổi mã enum (0, 1, 2) sang nhãn tiếng Việt & màu sắc
│   ├── router/
│   │   └── index.ts              # Định nghĩa routes (Home, MyLibrary)
│   ├── services/                 # Gọi API Backend theo mô hình kế thừa OOP
│   │   ├── apiService.ts         # Base ApiService config Axios & các hàm get, post, patch, delete
│   │   ├── bookService.ts        # Kế thừa ApiService để gọi API tìm kiếm & chi tiết sách
│   │   └── libraryService.ts     # Kế thừa ApiService để gọi API tủ sách & thống kê
│   ├── stores/                   # Quản lý State với Pinia
│   │   ├── bookStore.ts          # State tìm kiếm, phân trang, danh mục sách
│   │   ├── libraryStore.ts       # State tủ sách, thống kê, thao tác CRUD
│   │   └── toastStore.ts         # Queue quản lý thông báo người dùng
│   ├── types/                    # TypeScript interfaces & enums
│   │   ├── apiTypes.ts           # Cấu trúc chuẩn { data, meta, error }
│   │   ├── bookTypes.ts          # Interface Book, SearchResponse
│   │   └── libraryTypes.ts       # Enum ReadingStatus, LibraryBook, LibraryStats
│   ├── utils/                    # Helper functions
│   │   ├── formatters.ts         # Format ngày tháng, tính toán %
│   │   └── constants.ts          # Cấu hình enum, pagination limit, default cover
│   ├── App.vue                   # Component gốc, gắn Header & ToastContainer
│   └── main.ts                   # Điểm khởi tạo ứng dụng
├── .env.example                  # Mẫu biến môi trường
├── .env.development              # Biến môi trường dev (http://localhost:3000)
├── .env.production               # Biến môi trường production (URL BE thật)
├── .gitignore                    # Bỏ qua node_modules, dist, logs
├── index.html
├── package.json
├── postcss.config.js             # Cấu hình PostCSS cho Tailwind
├── tailwind.config.js            # Cấu hình theme, colors, fonts cho Tailwind
├── tsconfig.json
└── vite.config.ts
```

---

## 4. MÔ HÌNH DỮ LIỆU & TYPE DEFINITIONS (TYPESCRIPT)

Tạo thư mục `src/types/` với các interface bám sát mục 4 của `doc.md`:

### 4.1. Enum trạng thái đọc (`src/types/libraryTypes.ts`)
```typescript
export enum ReadingStatus {
  NOT_READ = 0, // Chưa đọc / Muốn đọc
  READING = 1,  // Đang đọc
  COMPLETED = 2 // Đọc xong / Đã đọc
}

export interface LibraryBook {
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  status: ReadingStatus;
  currentPage: number;
  totalPages: number;
  rating: number;          // Kiểu number: 1-5 sao, mặc định là 0 nếu chưa đánh giá
  note: string;
  startedAt?: string | null;
  finishedAt?: string | null;
}

// Thống kê tự tính toán trực tiếp trên FE (qua getters/computed từ libraryBooks)
export interface LibraryStats {
  totalBooks: number;
  readingBooks: number;
  finishedBooks: number;
}

export interface AddBookPayload {
  bookId: number;
  status: ReadingStatus; // Chọn ban đầu: 0, 1 hoặc 2
}

export interface UpdateBookPayload {
  status?: ReadingStatus;
  currentPage?: number;
  rating?: number;       // 1-5 hoặc 0 (chưa đánh giá)
  note?: string;
}
```

### 4.2. Kiểu dữ liệu Sách & Tìm kiếm (`src/types/bookTypes.ts`)
```typescript
export interface BookItem {
  bookId: number;
  title: string;
  author: string;
  firstPublishYear?: number | null;
  coverUrl: string;
  isInLibrary: boolean;
}

export interface BookDetail extends BookItem {
  description: string;
  subjects: string[];
  totalPages: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BookSearchParams {
  query: string;
  page: number;
  limit?: number; // Mặc định 20
}
```

### 4.3. Định dạng Response & Error chuẩn (`src/types/apiTypes.ts`)
```typescript
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  error: {
    code: string;       // Ví dụ: 'BOOK_ALREADY_EXISTS', 'VALIDATION_ERROR'
    message: string;    // Thông báo thân thiện tiếng Việt
    details?: unknown;
  };
}
```

---

## 5. THIẾT KẾ ROUTING & QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

### 5.1. Thiết kế Routes (`src/router/index.ts`)
Chi tiết sách được thiết kế dưới dạng **Modal popup (`BookDetailModal.vue`)** mở trực tiếp từ danh sách sách (không chuyển trang). Do đó hệ thống chỉ cần 2 route chính:

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import BookSearchPage from '@/pages/search/BookSearchPage.vue';
import MyLibraryPage from '@/pages/library/MyLibraryPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'BookSearch',
    component: BookSearchPage,
    meta: { title: 'Tìm kiếm sách — Mini Reading Tracker' }
  },
  {
    path: '/my-library',
    name: 'MyLibrary',
    component: MyLibraryPage,
    meta: { title: 'Tủ sách của tôi — Mini Reading Tracker' }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});
```

### 5.2. Quản lý State bằng Pinia

#### A. `useBookStore` (`src/stores/bookStore.ts`)
- **State:** `books: BookItem[]`, `meta: PaginationMeta`, `searchQuery: string`, `currentPage: number`, `isLoading: boolean`, `error: string | null`, `currentBookDetail: BookDetail | null`.
- **Actions (thực thi qua `bookService`):**
  - `searchBooks(query, page)`: Gọi `bookService.searchBooks(...)`, tự động cập nhật danh sách và meta.
  - `fetchBookDetail(bookId)`: Lấy chi tiết sách qua `bookService.getBookDetail(bookId)`.
  - `markBookAsAdded(bookId)`: Đồng bộ cục bộ chuyển cờ `isInLibrary = true` sau khi thêm vào tủ sách thành công.

#### B. `useLibraryStore` (`src/stores/libraryStore.ts`)
- **State:** `libraryBooks: LibraryBook[]`, `selectedStatusTab: ReadingStatus | null`, `isLoading: boolean`, `isUpdating: boolean`.
- **Getters (tính toán tự động từ `libraryBooks`, không cần gọi API riêng):**
  - `stats: LibraryStats`:
    - `totalBooks`: Tổng số sách trong tủ (`libraryBooks.length`).
    - `readingBooks`: Số sách có `status === ReadingStatus.READING`.
    - `finishedBooks`: Số sách có `status === ReadingStatus.COMPLETED`.
- **Actions (thực thi qua `libraryService`):**
  - `fetchLibraryBooks(status?)`: Gọi `libraryService.getLibrary(status)`.
  - `addToLibrary(bookId, status)`: Gọi `libraryService.addToLibrary(...)`, cập nhật danh sách local và thông báo toast.
  - `updateBookProgress(bookId, payload)`: Gọi `libraryService.updateLibraryBook(...)`, tự cập nhật state nếu `currentPage === totalPages` (chuyển sang `COMPLETED`).
  - `removeBook(bookId)`: Gọi `libraryService.removeBook(...)`, xóa khỏi danh sách local và tự động cập nhật lại stats qua getters.

#### C. `useToastStore` (`src/stores/toastStore.ts`)
- Hỗ trợ hiển thị toast góc phải trên với các mức độ: `success`, `error`, `info`, tự tắt sau 3–4 giây.

---

## 6. TẦNG TÍCH HỢP API (API SERVICE LAYER) & XỬ LÝ LỖI

Hệ thống áp dụng mô hình Hướng đối tượng (OOP) chuẩn mực:
- **`ApiService` (Base Class):** Khởi tạo cấu hình Axios instance, gắn Interceptors chuẩn hóa lỗi tập trung (`400`, `404`, `409 Conflict`, `500...`) và định nghĩa các generic methods: `get`, `post`, `patch`, `delete`.
- **`BookService` & `LibraryService`:** Kế thừa trực tiếp từ `ApiService` để thực thi các nghiệp vụ cụ thể, bảo đảm tính nhất quán và dễ mở rộng.

### 6.1. Lớp cơ sở `ApiService` (`src/services/apiService.ts`)
`ApiService` chỉ đảm nhiệm vai trò cấu hình hạ tầng HTTP và chuẩn hóa để **chỉ reject về mã lỗi (HTTP status code hoặc error code)**, không ném cả object lỗi cồng kềnh:

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export class ApiService {
  protected http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Chỉ reject về mã lỗi (HTTP Status Code number, hoặc string code nếu lỗi mạng/timeout)
        const errorCode: number | string = error.response?.status || error.code || 'UNKNOWN_ERROR';
        return Promise.reject(errorCode);
      }
    );
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, config);
    return response.data;
  }

  protected async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.post<T>(url, data, config);
    return response.data;
  }

  protected async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.patch<T>(url, data, config);
    return response.data;
  }

  protected async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.delete<T>(url, config);
    return response.data;
  }
}
```

### 6.2. Triển khai các Service kế thừa `ApiService`

Các service con nhận **mã lỗi** được reject từ `ApiService` để ánh xạ thành thông điệp nghiệp vụ tương ứng:

#### `src/services/bookService.ts`
```typescript
import { ApiService } from './apiService';
import type { ApiResponse, BookItem, BookDetail, BookSearchParams } from '@/types';

export class BookService extends ApiService {
  // Tìm kiếm sách (GET /api/books?query=...&page=...&limit=...)
  async searchBooks(params: BookSearchParams): Promise<ApiResponse<BookItem[]>> {
    try {
      return await this.get<ApiResponse<BookItem[]>>('/books', {
        params: {
          query: params.query,
          page: params.page,
          limit: params.limit || 20
        }
      });
    } catch (errorCode) {
      throw this.handleBookError(errorCode);
    }
  }

  // Chi tiết sách (GET /api/books/:bookId)
  async getBookDetail(bookId: number): Promise<BookDetail> {
    try {
      const response = await this.get<ApiResponse<BookDetail>>(`/books/${bookId}`);
      return response.data;
    } catch (errorCode) {
      throw this.handleBookError(errorCode);
    }
  }


  // Xử lý thông điệp dựa trên mã lỗi (status code)
  private handleBookError(errorCode: unknown): Error {
    switch (errorCode) {
      case 404:
        return new Error('Không tìm thấy thông tin cuốn sách yêu cầu.');
      case 500:
        return new Error('Lỗi máy chủ khi truy vấn dữ liệu sách.');
      case 'ECONNABORTED':
        return new Error('Hết thời gian chờ phản hồi. Vui lòng kiểm tra lại mạng.');
      default:
        return new Error('Đã có lỗi xảy ra khi tải dữ liệu sách.');
    }
  }
}

export const bookService = new BookService();
```

#### `src/services/libraryService.ts`
```typescript
import { ApiService } from './apiService';
import type { ApiResponse, LibraryBook, AddBookPayload, UpdateBookPayload, ReadingStatus } from '@/types';

export class LibraryService extends ApiService {
  // Danh sách sách trong tủ (GET /api/library?status=...)
  async getLibrary(status?: ReadingStatus): Promise<LibraryBook[]> {
    try {
      const response = await this.get<ApiResponse<LibraryBook[]>>('/library', {
        params: status !== undefined ? { status } : {}
      });
      return response.data;
    } catch (errorCode) {
      throw this.handleLibraryError(errorCode, 'Không thể tải danh sách tủ sách.');
    }
  }

  // Thêm sách vào tủ (POST /api/library)
  async addToLibrary(payload: AddBookPayload): Promise<LibraryBook> {
    try {
      const response = await this.post<ApiResponse<LibraryBook>>('/library', payload);
      return response.data;
    } catch (errorCode) {
      if (errorCode === 409) {
        throw new Error('Sách này đã tồn tại trong tủ sách của bạn!');
      }
      throw this.handleLibraryError(errorCode, 'Thêm sách vào tủ thất bại.');
    }
  }

  // Cập nhật tiến độ / rating / ghi chú (PATCH /api/library/:bookId)
  async updateLibraryBook(bookId: number, payload: UpdateBookPayload): Promise<LibraryBook> {
    try {
      const response = await this.patch<ApiResponse<LibraryBook>>(`/library/${bookId}`, payload);
      return response.data;
    } catch (errorCode) {
      throw this.handleLibraryError(errorCode, 'Cập nhật thông tin sách thất bại.');
    }
  }

  // Xóa sách khỏi tủ (DELETE /api/library/:bookId)
  async removeBook(bookId: number): Promise<void> {
    try {
      await this.delete<void>(`/library/${bookId}`);
    } catch (errorCode) {
      throw this.handleLibraryError(errorCode, 'Xóa sách khỏi tủ thất bại.');
    }
  }

  // Xử lý thông điệp dựa trên mã lỗi đặc thù của tủ sách
  private handleLibraryError(errorCode: unknown, fallbackMessage: string): Error {
    switch (errorCode) {
      case 400:
      case 422:
        return new Error('Số trang đọc hoặc dữ liệu cập nhật không hợp lệ.');
      case 404:
        return new Error('Không tìm thấy cuốn sách này trong tủ.');
      case 500:
        return new Error('Lỗi máy chủ khi thao tác với tủ sách.');
      case 'ECONNABORTED':
        return new Error('Hết thời gian chờ kết nối. Vui lòng thử lại.');
      default:
        return new Error(fallbackMessage);
    }
  }
}

export const libraryService = new LibraryService();
```

---

## 7. CHI TIẾT TRIỂN KHAI GIAO DIỆN & COMPONENT (UI/UX)

### 7.1. Màn hình 1 — Tìm kiếm sách (Trang chủ)
- **Vị trí file:** `src/pages/search/BookSearchPage.vue`
- **Components riêng của trang (`src/pages/search/components/`):**
  - **`BookSearchInput.vue`:** Input text với debounce 400ms, hỗ trợ tìm theo tên sách hoặc tác giả, có nút xóa nhanh icon `X`.
  - **`SearchSkeleton.vue`:** Hiển thị hiệu ứng tải dạng skeleton cards (6–8 items).
  - **`SearchEmptyState.vue`:** Minh họa trạng thái không tìm thấy kết quả + gợi ý tìm kiếm.
  - **`BookCard.vue`:**
    - Ảnh bìa sách (sử dụng ảnh proxy từ BE, có fallback ảnh mặc định nếu ảnh lỗi `@error`).
    - Tên sách (cắt tối đa 2 dòng - line-clamp-2).
    - Tên tác giả và năm xuất bản.
    - **Nút hành động:**
      - Nếu `isInLibrary === true`: Hiển thị Badge "✓ Đã có trong tủ" (disable click).
      - Nếu `isInLibrary === false`: Hiển thị nút `+ Thêm vào tủ`. Khi click, mở `AddToLibraryModal.vue` cho phép chọn trạng thái ban đầu (`NOT_READ`, `READING`, `COMPLETED`).
    - Nút phụ "Xem chi tiết": Kích hoạt mở modal `BookDetailModal.vue`.
  - **`SearchPagination.vue`:** Thanh phân trang (số trang hiện tại / tổng trang, nút Trang trước / Trang sau).

### 7.2. Màn hình 2 — Modal Chi tiết sách
- **Vị trí file:** `src/pages/search/components/BookDetailModal.vue`
- **Thành phần UI:**
  - Layout chia 2 cột: Cột trái ảnh bìa cỡ lớn; Cột phải thông tin chi tiết.
  - Tên sách (`h2`), Tác giả, Năm xuất bản, Số trang (`totalPages`).
  - Danh sách chủ đề (`subjects` tags/pills).
  - Khối mô tả sách (`description`) có thanh cuộn mượt mà.
  - Khu vực hành động:
    - Nếu sách đã có trong tủ: Hiển thị badge "✓ Đã có trong tủ sách" và nút điều hướng nhanh sang Tủ sách.
    - Nếu sách chưa có: Nút "Thêm vào tủ sách" mở modal/dropdown chọn trạng thái đọc (`0`, `1`, `2`).

### 7.3. Màn hình 3 — Tủ sách của tôi
- **Vị trí file:** `src/pages/library/MyLibraryPage.vue`
- **Components riêng của trang (`src/pages/library/components/`):**
  - **`LibraryStatsHeader.vue`:** 3 Card thống kê nổi bật:
    1. Tổng số sách (`totalBooks`) - Icon cuốn sách.
    2. Đang đọc (`readingBooks`) - Icon kính lúp / đồng hồ cát.
    3. Đã đọc xong (`finishedBooks`) - Icon cúp / dấu check xanh.
  - **`LibraryFilterTabs.vue`:** 4 lựa chọn (Tất cả, Muốn đọc `status=0`, Đang đọc `status=1`, Đã đọc `status=2`).
  - **`LibraryBookCard.vue`:**
    - Ảnh bìa, Tên sách, Tác giả.
    - Badge trạng thái hiện tại (Đổi màu theo status: Xám cho Muốn đọc, Xanh dương cho Đang đọc, Xanh lá cho Đã đọc).
    - **Thanh tiến độ (`ProgressBar.vue`):** Tự tính toán phần trăm trên FE theo công thức `totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0`, hiển thị: `{currentPage} / {totalPages} trang ({progress}%)`.
    - **Đánh giá (`StarRating.vue`):** Hiển thị số sao dựa trên `rating` (kiểu `number`, giá trị `0` là chưa đánh giá, `1`–`5` là số sao đã chấm).
    - **Ghi chú ngắn:** Hiển thị trích đoạn ghi chú nếu có.
    - **Nhóm nút chức năng:**
      - Nút "Cập nhật tiến độ": Mở popup `UpdateProgressModal.vue` để chỉnh sửa số trang và đổi trạng thái.
      - Nút "Đánh giá & Ghi chú": Mở `RatingModal.vue` chọn 1-5 sao và viết note.
      - Nút "Xóa": Icon thùng rác đỏ, mở hộp thoại `ConfirmDeleteModal.vue`.

### 7.4. Các Modal nghiệp vụ quan trọng
1. **`AddToLibraryModal.vue` (`src/pages/search/components/AddToLibraryModal.vue`):**
   - Cho phép chọn 1 trong 3 trạng thái ban đầu: `0` (Muốn đọc), `1` (Đang đọc), `2` (Đã đọc).
   - Nút "Xác nhận thêm" và "Hủy".
2. **`UpdateProgressModal.vue` (`src/pages/library/components/UpdateProgressModal.vue`):**
   - Input số trang đọc hiện tại: `0 ≤ currentPage ≤ totalPages`.
   - Selector đổi trạng thái thủ công (nếu cần).
   - Text helper: *"Nếu nhập bằng tổng số trang ({totalPages}), trạng thái sẽ tự động chuyển thành 'Đã đọc'."*
3. **`ConfirmDeleteModal.vue` (`src/pages/library/components/ConfirmDeleteModal.vue`):**
   - Cảnh báo: *"Bạn có chắc chắn muốn xóa cuốn sách '{title}' khỏi tủ sách không? Thao tác này không thể hoàn tác."*
   - Nút "Hủy bỏ" và nút "Xác nhận xóa" (màu đỏ nguy hiểm).

---

## 8. QUY TẮC NGHIỆP VỤ FRONTEND (BUSINESS LOGIC RULES)

| Quy tắc nghiệp vụ | Cách Frontend xử lý & hiển thị |
| :--- | :--- |
| **Chống thêm trùng sách** | Khi Backend trả `409 Conflict`, chặn crash, hiển thị Toast cảnh báo: *"Sách này đã có trong tủ của bạn!"* và lập tức đồng bộ `isInLibrary = true` trên giao diện. |
| **Ràng buộc số trang hợp lệ** | Validate ở phía Client trước khi gửi API: `0 ≤ currentPage ≤ totalPages`. Nếu nhập sai, hiển thị inline error: *"Số trang phải từ 0 đến {totalPages}"* và disable nút Lưu. |
| **Tự động chuyển Đã đọc** | Khi cập nhật `currentPage === totalPages`, cập nhật UI phản ánh kết quả response từ Backend (`status = 2`), tự động cập nhật lại các chỉ số thống kê (computed/getters). |
| **Đánh giá sao** | Cho phép đánh giá từ 1 đến 5 sao nguyên; nếu chưa đánh giá hoặc bỏ đánh giá thì gán `rating = 0` (kiểu `number`). |
| **Ngày đọc (startedAt, finishedAt)** | Frontend **không tự tính ngày giờ**, chỉ hiển thị định dạng ngày thân thiện (VD: `dd/MM/yyyy`) từ các trường `startedAt`, `finishedAt` do Backend trả về. |
| **Xóa sách an toàn** | Luôn mở Modal xác nhận trước khi gọi `DELETE /api/library/:bookId`. Sau khi xóa thành công, hiển thị Toast thông báo và tự động tải lại danh sách/stats. |

---

## 9. LỘ TRÌNH TRIỂN KHAI CHI TIẾT (CÁC BƯỚC THỰC HIỆN)

```
[Bước 1: Setup & Foundation]
   ├── Khởi tạo Vite + Vue 3 + TS + Tailwind
   ├── Config Router (2 trang), Pinia, Axios client
   └── Định nghĩa TypeScript types & Layout toàn cục (Header, Toast)
[Bước 2: Tìm kiếm & Modal Chi tiết sách]
   ├── API Books Service + bookStore
   ├── Trang tìm kiếm: BookSearchInput (debounce), BookCard, Pagination
   └── Modal chi tiết: BookDetailModal + AddToLibraryModal
[Bước 3: Tủ sách cá nhân & Thao tác CRUD]
   ├── API Library Service + libraryStore
   ├── Thống kê 3 thẻ + 3 Tabs lọc trạng thái (0, 1, 2)
   └── Thẻ sách trong tủ, cập nhật trang/%, rating 1–5 sao, note & xóa
[Bước 4: Tối ưu UI/UX & Xử lý biên]
   ├── Skeleton Loading, Empty States, Error Toast
   ├── Chống thêm trùng (409), validate trang đọc (0 ≤ current ≤ total)
   └── Tối ưu giao diện Responsive (Mobile / Tablet / Desktop)
[Bước 5: Kiểm thử, Đóng gói & Triển khai HTTPS]
   ├── E2E Walkthrough theo checklist nghiệm thu
   ├── Build production bundle (không lỗi TS/chunk)
   └── Triển khai công khai có HTTPS (Vercel / Netlify)
```

### Chi tiết từng bước thực hiện:

#### BƯỚC 1: Thiết lập nền tảng dự án (Project Initialization & Architecture)
- Khởi tạo project: `npm create vite@latest . -- --template vue-ts`.
- Cài đặt thư viện chính: `npm install vue-router pinia axios lucide-vue-next`.
- Cài đặt & cấu hình **Tailwind CSS**:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
  - Cấu hình `content` trong `tailwind.config.js`: `["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"]`.
  - Khai báo các directives vào `src/assets/styles/main.css`:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
- Định nghĩa toàn bộ TypeScript Interfaces trong `src/types/` (`apiTypes.ts`, `bookTypes.ts`, `libraryTypes.ts`).
- Xây dựng lớp cơ sở `ApiService` (`src/services/apiService.ts`) tích hợp cấu hình Axios, interceptors reject mã lỗi và các hàm HTTP generic (`get`, `post`, `patch`, `delete`).
- Xây dựng Layout chung (`src/components/AppHeader.vue`, `src/components/ToastContainer.vue`).

#### BƯỚC 2: Màn hình Tìm kiếm & Modal Chi tiết sách (Search & Book Detail Modal)
- Xây dựng `bookService` kế thừa `ApiService` và `useBookStore`.
- Triển khai Màn hình Tìm kiếm (`src/pages/search/BookSearchPage.vue`):
  - Ô input tìm kiếm kết hợp debounce 400ms (`BookSearchInput.vue`).
  - Lưới card kết quả tìm kiếm (`BookCard.vue`) kèm ảnh bìa proxy, tác giả, năm.
  - Phân trang (`SearchPagination.vue`).
  - Trạng thái Loading skeleton (`SearchSkeleton.vue`) và Empty state (`SearchEmptyState.vue`).
- Triển khai Modal Chi tiết sách (`src/pages/search/components/BookDetailModal.vue`):
  - Hiển thị mô tả, subjects, tổng số trang.
  - Modal thêm sách vào tủ (`AddToLibraryModal.vue`) với 3 trạng thái ban đầu (`0`, `1`, `2`).
  - Xử lý đồng bộ badge "Đã thêm" trên thẻ sách ngay sau khi thêm thành công.

#### BƯỚC 3: Màn hình Tủ sách cá nhân & Thao tác CRUD (My Library)
- Xây dựng `libraryService` (chỉ gồm API get library, add, update, delete) và `useLibraryStore`.
- Triển khai Màn hình Tủ sách (`src/pages/library/MyLibraryPage.vue`):
  - Header thống kê (`LibraryStatsHeader.vue`) hiển thị 3 chỉ số (`totalBooks`, `readingBooks`, `finishedBooks`) tự động tính từ Pinia getters.
  - Thanh điều hướng 3 tab trạng thái: Muốn đọc, Đang đọc, Đã đọc (`LibraryFilterTabs.vue`).
  - Thẻ sách trong tủ (`LibraryBookCard.vue`) với thanh tiến độ (`ProgressBar.vue`), đánh giá sao (`StarRating.vue`), nút cập nhật (`UpdateProgressModal.vue`) và xóa (`ConfirmDeleteModal.vue`).

#### BƯỚC 4: Tinh chỉnh trải nghiệm người dùng & Xử lý lỗi biên (Edge Cases & Polish)
- Kiểm tra toàn bộ các luồng thông báo lỗi:
  - Bắt lỗi trùng sách `409 Conflict` và hiển thị Toast phù hợp.
  - Validate chặn nhập số trang âm hoặc vượt quá tổng số trang.
  - Xử lý sách không có ảnh bìa bằng ảnh fallback mặc định.
- Tối ưu giao diện Responsive hoàn chỉnh trên cả Mobile (375px), Tablet (768px) và Desktop (1280px+).
- Thêm hiệu ứng chuyển cảnh mượt mà (transitions khi đổi tab, mở modal).

#### BƯỚC 5: Kiểm thử, Đóng gói & Triển khai Public HTTPS (Testing & Deployment)
- Chạy test kiểm tra toàn bộ luồng nghiệp vụ theo Checklist nghiệm thu.
- Kiểm tra biến môi trường `.env.production` trỏ chính xác về Backend.
- Chạy `npm run build` kiểm tra không có lỗi TypeScript hay build chunk.
- Triển khai Frontend lên nền tảng đám mây công khai hỗ trợ HTTPS tự động: **Vercel**, **Netlify**, hoặc **Cloudflare Pages**.
- Chuẩn bị dữ liệu demo trực quan và viết tài liệu bàn giao `README.md`.

---

## 10. CHECKLIST NGHIỆM THU CHẤT LƯỢNG (QA & DELIVERY)

Trước khi bàn giao bài test, FE Developer cần tự kiểm tra từng tiêu chí sau:

### Chức năng & Giao diện
- [ ] Đủ 3 màn hình theo đặc tả (Tìm kiếm, Chi tiết sách, Tủ sách cá nhân).
- [ ] Tìm kiếm sách theo từ khóa tên hoặc tác giả mượt mà, có debounce.
- [ ] Kết quả tìm kiếm hiển thị đầy đủ: Ảnh bìa (proxy từ BE), Tên sách, Tác giả, Năm XB.
- [ ] Có phân trang rõ ràng và chuyển trang chính xác.
- [ ] Trạng thái Loading, Empty (không có kết quả) và Error hiển thị thân thiện.
- [ ] Thẻ sách hiển thị chính xác nút `+ Thêm vào tủ` hoặc Badge `Đã thêm`.
- [ ] Màn hình chi tiết hiển thị đủ: Mô tả, Số trang, Subjects, Năm xuất bản.
- [ ] Tủ sách có đủ 3 thẻ thống kê (Tổng số sách, Đang đọc, Đã đọc xong).
- [ ] Tủ sách có 3 tab trạng thái tương ứng enum `0`, `1`, `2`.
- [ ] Thanh tiến độ tính chính xác % và số trang `currentPage / totalPages`.
- [ ] Cho phép cập nhật số trang, cập nhật trạng thái đọc, chấm điểm 1–5 sao và ghi chú.
- [ ] Xóa sách có modal popup xác nhận trước khi thực hiện.

### Quy tắc Nghiệp vụ & Kỹ thuật
- [ ] Nhận diện và hiển thị thông báo thân thiện khi Backend trả lỗi `409 Conflict` (sách trùng).
- [ ] Chặn nhập số trang không hợp lệ (số âm hoặc vượt quá tổng số trang).
- [ ] Đọc đủ số trang tự động cập nhật trạng thái `Đã đọc` theo dữ liệu BE.
- [ ] Tuyệt đối **không gọi trực tiếp Open Library** từ mã nguồn Frontend.
- [ ] Toàn bộ ảnh bìa được load qua endpoint của Backend (`/api/books/:bookId/cover`).
- [ ] Deploy hoàn tất trên hosting có **HTTPS công khai**.
- [ ] Có dữ liệu mẫu hiển thị đẹp mắt để người chấm có thể kiểm thử ngay.

---
*Tài liệu được biên soạn dựa trên đặc tả hệ thống Mini Reading Tracker — Sẵn sàng cho triển khai thực tế.*
