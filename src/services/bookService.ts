import { ApiService } from './apiService';
import type { ApiResponse, BookItem, BookDetail, BookSearchParams } from '@/types';
import { ApiEndpoints } from '@/constants/apiEndpoints';

export class BookService extends ApiService {
  async searchBooks(params: BookSearchParams): Promise<ApiResponse<BookItem[]>> {
    try {
      return await this.get<ApiResponse<BookItem[]>>(ApiEndpoints.books.getAll, {
        params: {
          keyword: params.keyword,
          page: params.page,
          limit: params.limit || 10
        }
      });
    } catch (errorCode) {
      throw this.handleBookError(errorCode);
    }
  }

  async getBookDetail(bookId: number): Promise<BookDetail> {
    try {
      const response = await this.get<ApiResponse<BookDetail>>(ApiEndpoints.books.getDetail(bookId));
      return response.data;
    } catch (errorCode) {
      throw this.handleBookError(errorCode);
    }
  }
  private handleBookError(errorCode: unknown): Error {
    switch (errorCode) {
      case 404:
        return new Error('Không tìm thấy thông tin cuốn sách yêu cầu.');
      case 500:
        return new Error('Lỗi máy chủ khi truy vấn dữ liệu sách.');
      case 'ECONNABORTED':
        return new Error('Hết thời gian chờ phản hồi từ máy chủ. Vui lòng kiểm tra lại mạng.');
      default:
        return new Error('Đã có lỗi xảy ra khi tải dữ liệu sách.');
    }
  }
}

export const bookService = new BookService();
