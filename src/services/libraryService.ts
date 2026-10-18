import { ApiService } from './apiService';
import type { ApiResponse, LibraryBook, AddBookPayload, UpdateBookPayload, ReadingStatus } from '@/types';
import { ApiEndpoints } from '@/constants/apiEndpoints';

export class LibraryService extends ApiService {
  // Danh sách sách trong tủ (GET /api/library?status=...)
  async getLibrary(status?: ReadingStatus): Promise<LibraryBook[]> {
    try {
      const response = await this.get<ApiResponse<LibraryBook[]>>(ApiEndpoints.library.getAll, {
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
      const response = await this.post<ApiResponse<LibraryBook>>(ApiEndpoints.library.create, payload);
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
      const response = await this.patch<ApiResponse<LibraryBook>>(ApiEndpoints.library.getDetail(bookId), payload);
      return response.data;
    } catch (errorCode) {
      throw this.handleLibraryError(errorCode, 'Cập nhật thông tin sách thất bại.');
    }
  }

  // Xóa sách khỏi tủ (DELETE /api/library/:bookId)
  async removeBook(bookId: number): Promise<void> {
    try {
      await this.delete<void>(ApiEndpoints.library.getDetail(bookId));
    } catch (errorCode) {
      throw this.handleLibraryError(errorCode, 'Xóa sách khỏi tủ thất bại.');
    }
  }

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
