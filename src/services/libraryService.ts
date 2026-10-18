import { ApiService } from "./apiService";
import type { ApiResponse } from "@/types/apiTypes";
import type {
  LibraryBook,
  AddBookPayload,
  UpdateBookPayload,
} from "@/types/libraryTypes";
import { ReadingStatusEnum } from "@/constants/readingStatus";
import { apiEndpoints } from "@/constants/apiEndpoints";

export class LibraryService extends ApiService {
  async getLibrary(status?: ReadingStatusEnum): Promise<LibraryBook[]> {
    try {
      const response = await this.get<ApiResponse<LibraryBook[]>>(
        apiEndpoints.library.getAll,
        {
          params: status !== undefined ? { status } : {},
        },
      );
      return response.data;
    } catch (errorCode) {
      throw this.handleLibraryError(
        errorCode,
        "Không thể tải danh sách tủ sách.",
      );
    }
  }

  // Thêm sách vào tủ (POST /api/library)
  async addToLibrary(payload: AddBookPayload): Promise<LibraryBook> {
    try {
      const response = await this.post<ApiResponse<LibraryBook>>(
        apiEndpoints.library.create,
        payload,
      );
      return response.data;
    } catch (errorCode) {
      if (errorCode === 409) {
        throw new Error("Sách này đã tồn tại trong tủ sách của bạn!");
      }
      throw this.handleLibraryError(errorCode, "Thêm sách vào tủ thất bại.");
    }
  }

  // Cập nhật tiến độ / rating / ghi chú (PATCH /api/library/:bookId)
  async updateLibraryBook(payload: UpdateBookPayload): Promise<LibraryBook> {
    try {
      const response = await this.patch<ApiResponse<LibraryBook>>(
        apiEndpoints.library.patch(),
        payload,
      );
      return response.data;
    } catch (errorCode) {
      throw this.handleLibraryError(
        errorCode,
        "Cập nhật thông tin sách thất bại.",
      );
    }
  }

  // Xóa sách khỏi tủ (DELETE /api/library/:bookId)
  async removeBook(bookId: string): Promise<void> {
    try {
      await this.delete<void>(apiEndpoints.library.delete(bookId));
    } catch (errorCode) {
      throw this.handleLibraryError(errorCode, "Xóa sách khỏi tủ thất bại.");
    }
  }

  private handleLibraryError(
    errorCode: unknown,
    fallbackMessage: string,
  ): Error {
    switch (errorCode) {
      case 400:
      case 422:
        return new Error("Số trang đọc hoặc dữ liệu cập nhật không hợp lệ.");
      case 404:
        return new Error("Không tìm thấy cuốn sách này trong tủ.");
      case 500:
        return new Error("Lỗi máy chủ khi thao tác với tủ sách.");
      case "ECONNABORTED":
        return new Error("Hết thời gian chờ kết nối. Vui lòng thử lại.");
      default:
        return new Error(fallbackMessage);
    }
  }
}

export const libraryService = new LibraryService();
