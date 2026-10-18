<template>
  <div class="space-y-6">
    <!-- Header Page -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
        >
          Tủ sách của tôi
        </h1>
        <p class="text-sm text-slate-500 font-medium mt-1">
          Theo dõi tiến độ, cập nhật số trang đọc và lưu giữ cảm nhận của bạn.
        </p>
      </div>

      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-100 transition self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Khám phá thêm sách</span>
      </router-link>
    </div>

    <!-- 3 Thẻ thống kê (Tính toán tự động từ Pinia getters) -->
    <LibraryStatsHeader :stats="libraryStore.stats" />

    <!-- Thanh lọc 3 Tab trạng thái -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
    >
      <LibraryFilterTabs
        v-model="libraryStore.selectedStatusTab"
        :stats="libraryStore.stats"
      />

      <span class="text-xs font-semibold text-slate-500">
        Hiển thị {{ libraryStore.filteredBooks.length }} cuốn sách
      </span>
    </div>

    <!-- Loading State -->
    <div
      v-if="libraryStore.isLoading"
      class="flex flex-col items-center justify-center py-20 gap-3"
    >
      <div
        class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm font-semibold text-slate-500">Đang tải tủ sách...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="libraryStore.error"
      class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between"
    >
      <span>{{ libraryStore.error }}</span>
      <button
        @click="loadLibrary"
        class="font-bold underline hover:text-rose-950 ml-2"
      >
        Thử lại
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="libraryStore.filteredBooks.length === 0"
      class="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm"
    >
      <div
        class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3"
      >
        <BookOpenCheck class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-slate-800">
        Chưa có cuốn sách nào ở mục này
      </h3>
      <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
        Hãy tìm kiếm sách mới và thêm vào tủ để bắt đầu theo dõi hành trình đọc
        của bạn.
      </p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition"
      >
        <Search class="w-3.5 h-3.5" />
        <span>Tìm sách ngay</span>
      </router-link>
    </div>

    <!-- Book List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <LibraryBookCard
        v-for="book in libraryStore.filteredBooks"
        :key="book.id"
        :book="book"
        @view-detail="openDetailModal"
        @update-progress="openProgressModal"
        @rate-note="openRatingModal"
        @remove="openDeleteModal"
      />
    </div>

    <!-- Modals (Teleport ra body để phủ kín toàn màn hình bao gồm cả Header) -->
    <Teleport to="body">
      <!-- Modal Chi tiết sách -->
      <LibraryDetailModal
        v-if="showDetailModal && activeBook"
        :book="activeBook"
        @close="showDetailModal = false"
      />

      <!-- Modal Cập nhật tiến độ -->
      <UpdateProgressModal
        v-if="showProgressModal && activeBook"
        :book="activeBook"
        :is-submitting="isActionSubmitting"
        @close="showProgressModal = false"
        @save="handleSaveProgress"
      />

      <!-- Modal Đánh giá & Ghi chú -->
      <RatingModal
        v-if="showRatingModal && activeBook"
        :book="activeBook"
        :is-submitting="isActionSubmitting"
        @close="showRatingModal = false"
        @save="handleSaveRating"
      />

      <!-- Modal Xác nhận xóa -->
      <ConfirmDeleteModal
        v-if="showDeleteModal && activeBook"
        :book-title="activeBook.title"
        :is-submitting="isActionSubmitting"
        @close="showDeleteModal = false"
        @confirm="handleConfirmDelete"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLibraryStore } from "@/stores/libraryStore";
import { useToastStore } from "@/stores/toastStore";
import { type LibraryBook } from "@/types/libraryTypes";
import { Plus, Search, BookOpenCheck } from "lucide-vue-next";

import LibraryStatsHeader from "./components/LibraryStatsHeader.vue";
import LibraryFilterTabs from "./components/LibraryFilterTabs.vue";
import LibraryBookCard from "./components/LibraryBookCard.vue";
import LibraryDetailModal from "./modals/LibraryDetailModal.vue";
import UpdateProgressModal from "./modals/UpdateProgressModal.vue";
import RatingModal from "./modals/RatingModal.vue";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal.vue";

const libraryStore = useLibraryStore();
const toastStore = useToastStore();

const activeBook = ref<LibraryBook | null>(null);
const isActionSubmitting = ref(false);

const showDetailModal = ref(false);
const showProgressModal = ref(false);
const showRatingModal = ref(false);
const showDeleteModal = ref(false);

const openDetailModal = (book: LibraryBook) => {
  activeBook.value = book;
  showDetailModal.value = true;
};

const loadLibrary = () => {
  libraryStore.fetchLibraryBooks();
};

onMounted(() => {
  loadLibrary();
});

const openProgressModal = (book: LibraryBook) => {
  activeBook.value = book;
  showProgressModal.value = true;
};

const handleSaveProgress = async ({ currentPage }: { currentPage: number }) => {
  if (!activeBook.value) return;

  isActionSubmitting.value = true;
  try {
    await libraryStore.updateBookProgress({
      id: activeBook.value.id,
      currentPage,
    });
    toastStore.success("Đã cập nhật tiến độ đọc sách thành công!");
    showProgressModal.value = false;
  } catch (err: any) {
    toastStore.error(err.message || "Lỗi khi cập nhật tiến độ");
  } finally {
    isActionSubmitting.value = false;
  }
};

const openRatingModal = (book: LibraryBook) => {
  activeBook.value = book;
  showRatingModal.value = true;
};

const handleSaveRating = async ({
  rating,
  note,
}: {
  rating: number;
  note: string;
}) => {
  if (!activeBook.value) return;

  isActionSubmitting.value = true;
  try {
    await libraryStore.updateBookProgress({
      id: activeBook.value.id,
      rating,
      note,
    });
    toastStore.success("Đã lưu đánh giá & ghi chú!");
    showRatingModal.value = false;
  } catch (err: any) {
    toastStore.error(err.message || "Lỗi khi lưu đánh giá");
  } finally {
    isActionSubmitting.value = false;
  }
};

const openDeleteModal = (book: LibraryBook) => {
  activeBook.value = book;
  showDeleteModal.value = true;
};

const handleConfirmDelete = async () => {
  if (!activeBook.value) return;

  isActionSubmitting.value = true;
  try {
    await libraryStore.removeBook(activeBook.value.id);
    toastStore.success(`Đã xóa "${activeBook.value.title}" khỏi tủ sách.`);
    showDeleteModal.value = false;
  } catch (err: any) {
    toastStore.error(err.message || "Lỗi khi xóa sách");
  } finally {
    isActionSubmitting.value = false;
  }
};
</script>
