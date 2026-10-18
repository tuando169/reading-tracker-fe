<template>
  <div class="space-y-6">
    <!-- Hero / Header Search -->
    <div
      class="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-indigo-100/50 flex flex-col items-center text-center"
    >
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight max-w-xl">
        Tìm kiếm sách cho tủ sách của bạn
      </h1>
      <p class="text-indigo-100 text-xs sm:text-sm mt-1 max-w-lg">
        Nhập tên sách hoặc tác giả để tìm và thêm trực tiếp vào danh sách theo
        dõi.
      </p>

      <!-- Search Input Container -->
      <div class="w-full max-w-xl mt-4">
        <BookSearchInput v-model="searchQuery" @search="handleSearch" />
      </div>
    </div>

    <!-- Error state -->
    <div
      v-if="bookStore.error"
      class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between"
    >
      <span>{{ bookStore.error }}</span>
      <button
        @click="handleSearch(searchQuery)"
        class="font-bold underline hover:text-rose-950 ml-2"
      >
        Thử lại
      </button>
    </div>

    <!-- Loading Skeleton -->
    <SearchSkeleton v-if="bookStore.isLoading" />

    <!-- Empty State (Khi đã tìm kiếm nhưng không có kết quả) -->
    <div
      v-else-if="hasSearched && bookStore.books.length === 0"
      class="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm mx-auto my-6 max-w-lg"
    >
      <div
        class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3"
      >
        <BookDashed class="w-6 h-6" />
      </div>
      <h3 class="text-base font-bold text-slate-800 mb-1">
        Không tìm thấy cuốn sách nào
      </h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Hãy thử tìm kiếm với từ khóa khác như tên sách, tác giả hoặc từ khóa
        ngắn gọn hơn.
      </p>
    </div>

    <!-- Initial Welcome State (khi chưa gõ gì) -->
    <div
      v-else-if="!hasSearched && bookStore.books.length === 0"
      class="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
    >
      <div
        class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2"
      >
        <Sparkles class="w-6 h-6" />
      </div>
      <h3 class="text-sm font-bold text-slate-800">
        Bắt đầu bằng cách nhập từ khóa tìm kiếm
      </h3>
      <p class="text-xs text-slate-500 mt-1">
        Gõ bất kỳ tên tác phẩm hoặc tác giả bạn yêu thích vào ô bên trên.
      </p>
    </div>

    <!-- Books Grid -->
    <div v-else class="space-y-5">
      <div
        class="flex items-center justify-between text-xs font-semibold text-slate-500 px-1"
      >
        <span
          >Tìm thấy {{ bookStore.meta.total || bookStore.books.length }} kết
          quả</span
        >
        <span
          >Trang {{ bookStore.currentPage }} /
          {{ bookStore.meta.totalPages || 1 }}</span
        >
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <BookCard
          v-for="book in bookStore.books"
          :key="book.workId"
          :book="book"
          @view-detail="openAddModal(book)"
          @add-to-library="openAddModal(book)"
        />
      </div>

      <!-- Pagination -->
      <SearchPagination
        v-if="bookStore.books.length > 0"
        :current-page="bookStore.currentPage"
        :total-pages="bookStore.meta.totalPages"
        :limit="bookStore.meta.limit"
        @change-page="changePage"
      />
    </div>

    <!-- Modal Chọn trạng thái khi thêm vào tủ (Teleport ra body) -->
    <Teleport to="body">
      <AddToLibraryModal
        v-if="showAddModal && targetBook"
        :book="targetBook"
        :is-submitting="isSubmitting"
        @close="showAddModal = false"
        @confirm="(args) => confirmAddToLibrary(args)"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBookStore } from "@/stores/bookStore";
import { useLibraryStore } from "@/stores/libraryStore";
import { useToastStore } from "@/stores/toastStore";
import { type BookItem } from "@/types/bookTypes";
import { Sparkles, BookDashed } from "lucide-vue-next";

import BookSearchInput from "./components/BookSearchInput.vue";
import BookCard from "./components/BookCard.vue";
import SearchSkeleton from "./components/SearchSkeleton.vue";
import SearchPagination from "./components/SearchPagination.vue";
import AddToLibraryModal from "./modals/AddToLibraryModal.vue";
import { ReadingStatusEnum } from "@/constants/readingStatus.js";

const bookStore = useBookStore();
const libraryStore = useLibraryStore();
const toastStore = useToastStore();

const searchQuery = ref("");
const hasSearched = ref(false);

const showAddModal = ref(false);
const targetBook = ref<BookItem>();
const isSubmitting = ref(false);

const handleSearch = (query: string) => {
  const trimmed = query.trim();
  if (trimmed.length >= 3) {
    hasSearched.value = true;
    bookStore.searchBooks(trimmed, 1);
  } else {
    hasSearched.value = false;
    bookStore.books = [];
  }
};

const changePage = (page: number) => {
  const query = (searchQuery.value || bookStore.searchQuery).trim();
  if (query.length >= 3) {
    bookStore.searchBooks(query, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const openAddModal = (book: BookItem) => {
  targetBook.value = book;
  showAddModal.value = true;
};

const confirmAddToLibrary = async (status: ReadingStatusEnum) => {
  if (!targetBook.value) return;
  console.log(status);

  isSubmitting.value = true;
  try {
    await libraryStore.addToLibrary({
      id: targetBook.value.id,
      status,
    });
    toastStore.success(`Đã thêm "${targetBook.value.title}" vào tủ sách!`);
    showAddModal.value = false;
  } catch (err: any) {
    toastStore.error(err.message || "Lỗi khi thêm sách vào tủ");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
