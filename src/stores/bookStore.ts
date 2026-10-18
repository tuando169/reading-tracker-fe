import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bookService } from '@/services/bookService';
import type { PaginationMeta } from '@/types/apiTypes';
import type { BookItem, BookDetail, BookSearchParams } from '@/types/bookTypes';

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
      books.value = (response.data || []).map((item) => ({
        ...item,
        inLibrary: Boolean(item.inLibrary)
      }));
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


  const markBookAsAdded = (bookId: string | number) => {
    const book = books.value.find((b) => String(b.id) === String(bookId));
    if (book) {
      book.inLibrary = true;
    }
    if (currentBookDetail.value && String(currentBookDetail.value.id) === String(bookId)) {
      currentBookDetail.value.inLibrary = true;
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
    markBookAsAdded
  };
});
