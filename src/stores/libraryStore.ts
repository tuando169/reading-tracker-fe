import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { libraryService } from '@/services/libraryService';
import { useBookStore } from './bookStore';
import { ReadingStatus } from '@/types';
import type { LibraryBook, AddBookPayload, UpdateBookPayload, LibraryStats } from '@/types';

export const useLibraryStore = defineStore('library', () => {
  const libraryBooks = ref<LibraryBook[]>([]);
  const selectedStatusTab = ref<ReadingStatus | null>(null);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Thống kê tự tính toán trực tiếp trên FE từ danh sách sách (Getters)
  const stats = computed<LibraryStats>(() => {
    const total = libraryBooks.value.length;
    const reading = libraryBooks.value.filter((b) => b.status === ReadingStatus.READING).length;
    const completed = libraryBooks.value.filter((b) => b.status === ReadingStatus.COMPLETED).length;

    return {
      totalBooks: total,
      readingBooks: reading,
      finishedBooks: completed
    };
  });

  // Lọc sách theo tab hiện tại (nếu null là lấy tất cả)
  const filteredBooks = computed<LibraryBook[]>(() => {
    if (selectedStatusTab.value === null) {
      return libraryBooks.value;
    }
    return libraryBooks.value.filter((book) => book.status === selectedStatusTab.value);
  });

  const fetchLibraryBooks = async (status?: ReadingStatus) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Tải tất cả hoặc theo status
      const data = await libraryService.getLibrary(status);
      libraryBooks.value = data;
    } catch (err: any) {
      error.value = err.message || 'Không thể tải tủ sách';
    } finally {
      isLoading.value = false;
    }
  };

  const addToLibrary = async (payload: AddBookPayload): Promise<LibraryBook> => {
    isUpdating.value = true;
    try {
      const newBook = await libraryService.addToLibrary(payload);
      // Cập nhật local list nếu chưa có
      const exists = libraryBooks.value.some((b) => b.bookId === newBook.bookId);
      if (!exists) {
        libraryBooks.value.unshift(newBook);
      }
      // Đồng bộ cờ isInLibrary bên bookStore
      const bookStore = useBookStore();
      bookStore.markBookAsAdded(payload.bookId);
      return newBook;
    } finally {
      isUpdating.value = false;
    }
  };

  const updateBookProgress = async (bookId: number, payload: UpdateBookPayload): Promise<LibraryBook> => {
    isUpdating.value = true;
    try {
      const updated = await libraryService.updateLibraryBook(bookId, payload);
      const index = libraryBooks.value.findIndex((b) => b.bookId === bookId);
      if (index !== -1) {
        libraryBooks.value[index] = { ...libraryBooks.value[index], ...updated };
      }
      return updated;
    } finally {
      isUpdating.value = false;
    }
  };

  const removeBook = async (bookId: number): Promise<void> => {
    isUpdating.value = true;
    try {
      await libraryService.removeBook(bookId);
      libraryBooks.value = libraryBooks.value.filter((b) => b.bookId !== bookId);
    } finally {
      isUpdating.value = false;
    }
  };

  const setStatusTab = (status: ReadingStatus | null) => {
    selectedStatusTab.value = status;
  };

  return {
    libraryBooks,
    selectedStatusTab,
    isLoading,
    isUpdating,
    error,
    stats,
    filteredBooks,
    fetchLibraryBooks,
    addToLibrary,
    updateBookProgress,
    removeBook,
    setStatusTab
  };
});
