import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookService } from '@/services/bookService';
import type { BookItem, BookDetail, PaginationMeta, BookSearchParams } from '@/types';

export const useBookStore = defineStore('book', () => {
  const books = ref<BookItem[]>([]);
  const meta = ref<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const searchQuery = ref<string>('');
  const currentPage = ref<number>(1);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const currentBookDetail = ref<BookDetail | null>(null);
  const isDetailLoading = ref<boolean>(false);

  const searchBooks = async (query: string, page = 1, limit?: number) => {
    searchQuery.value = query;
    currentPage.value = page;
    if (limit) {
      meta.value.limit = limit;
    }

    if (!query.trim()) {
      books.value = [];
      meta.value = { page: 1, limit: meta.value.limit || 10, total: 0, totalPages: 0 };
      error.value = null;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const params: BookSearchParams = { keyword: query, page, limit: meta.value.limit };
      const response = await bookService.searchBooks(params);
      books.value = response.data;
      if (response.meta) {
        meta.value = response.meta;
      }
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi tìm kiếm sách';
      books.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBookDetail = async (bookId: number): Promise<BookDetail | null> => {
    isDetailLoading.value = true;
    try {
      const detail = await bookService.getBookDetail(bookId);
      currentBookDetail.value = detail;
      return detail;
    } catch (err: any) {
      error.value = err.message || 'Lỗi khi tải chi tiết sách';
      return null;
    } finally {
      isDetailLoading.value = false;
    }
  };

  const markBookAsAdded = (bookId: number) => {
    const book = books.value.find((b) => b.id === bookId);
    if (book) {
      book.isInLibrary = true;
    }
    if (currentBookDetail.value && currentBookDetail.value.id === bookId) {
      currentBookDetail.value.isInLibrary = true;
    }
  };

  return {
    books,
    meta,
    searchQuery,
    currentPage,
    isLoading,
    error,
    currentBookDetail,
    isDetailLoading,
    searchBooks,
    fetchBookDetail,
    markBookAsAdded
  };
});
