import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { libraryService } from "@/services/libraryService";
import { useBookStore } from "./bookStore";
import { ReadingStatusEnum } from "@/constants/readingStatus";
import type {
  LibraryBook,
  AddBookPayload,
  UpdateBookPayload,
  LibraryStats,
} from "@/types/libraryTypes";

export const useLibraryStore = defineStore("library", () => {
  const libraryBooks = ref<LibraryBook[]>([]);
  const selectedStatusTab = ref<ReadingStatusEnum | null>(null);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Thống kê tự tính toán trực tiếp trên FE từ danh sách sách (Getters)
  const stats = computed<LibraryStats>(() => {
    const total = libraryBooks.value.length;
    const reading = libraryBooks.value.filter(
      (b) => b.status === ReadingStatusEnum.Reading,
    ).length;
    const completed = libraryBooks.value.filter(
      (b) => b.status === ReadingStatusEnum.Completed,
    ).length;

    return {
      totalBooks: total,
      readingBooks: reading,
      finishedBooks: completed,
    };
  });

  // Lọc sách theo tab hiện tại (nếu null là lấy tất cả)
  const filteredBooks = computed<LibraryBook[]>(() => {
    if (selectedStatusTab.value === null) {
      return libraryBooks.value;
    }
    return libraryBooks.value.filter(
      (book) => book.status === selectedStatusTab.value,
    );
  });

  const fetchLibraryBooks = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await libraryService.getLibrary();
      libraryBooks.value = data;
    } catch (err: any) {
      error.value = err.message || "Không thể tải tủ sách";
    } finally {
      isLoading.value = false;
    }
  };

  const addToLibrary = async (
    payload: AddBookPayload,
  ): Promise<LibraryBook> => {
    isUpdating.value = true;
    try {
      const newBook = await libraryService.addToLibrary(payload);
      // Cập nhật local list nếu chưa có
      const exists = libraryBooks.value.some((b) => b.id === newBook.id);
      if (!exists) {
        libraryBooks.value.unshift(newBook);
      }
      const bookStore = useBookStore();
      bookStore.markBookAsAdded(payload.id);
      return newBook;
    } finally {
      isUpdating.value = false;
    }
  };

  const updateBookProgress = async (
    payload: UpdateBookPayload,
  ): Promise<LibraryBook> => {
    isUpdating.value = true;
    try {
      const updated = await libraryService.updateLibraryBook(payload);
      const index = libraryBooks.value.findIndex((b) => b.id === payload.id);
      if (index !== -1) {
        libraryBooks.value[index] = {
          ...libraryBooks.value[index],
          ...updated,
        };
      }
      return updated;
    } finally {
      isUpdating.value = false;
    }
  };

  const removeBook = async (id: string): Promise<void> => {
    isUpdating.value = true;
    try {
      await libraryService.removeBook(id);
      libraryBooks.value = libraryBooks.value.filter((b) => b.id !== id);
    } finally {
      isUpdating.value = false;
    }
  };

  const setStatusTab = (status: ReadingStatusEnum | null) => {
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
    setStatusTab,
  };
});
