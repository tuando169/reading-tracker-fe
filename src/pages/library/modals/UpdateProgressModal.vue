<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-100"
      >
        <h3 class="text-base font-bold text-slate-900">Cập nhật tiến độ đọc</h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Book brief -->
      <div class="text-sm font-semibold text-slate-800">
        {{ book.title }}
      </div>

      <!-- Form Inputs -->
      <div class="space-y-4">
        <!-- Input & Slider số trang -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-slate-700">
              Tiến độ đọc:
            </label>
            <span
              v-if="book.totalPages && book.totalPages > 0"
              class="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md"
            >
              {{ progressPercent }}%
            </span>
          </div>

          <!-- Slider Range -->
          <div v-if="book.totalPages && book.totalPages > 0" class="space-y-1">
            <input
              type="range"
              v-model.number="currentPage"
              :min="0"
              :max="book.totalPages"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div
              class="flex justify-between text-[11px] font-semibold text-slate-400"
            >
              <span>0 trang</span>
              <span>{{ book.totalPages }} trang</span>
            </div>
          </div>

          <!-- Input số trang chỉnh tay -->
          <div class="relative">
            <input
              type="number"
              v-model.number="currentPage"
              :min="0"
              :max="book.totalPages || undefined"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-24"
              placeholder="Nhập số trang..."
            />
            <span
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 pointer-events-none"
            >
              / {{ book.totalPages ? `${book.totalPages} trang` : "trang" }}
            </span>
          </div>

          <!-- Validation warning -->
          <div style="min-height: 40px">
            <p
              class="text-xs font-medium text-rose-600 mt-1 transition-opacity duration-200"
              :class="
                validationError
                  ? 'opacity-100'
                  : 'opacity-0 select-none pointer-events-none'
              "
            >
              {{ validationError || "&nbsp;" }}
            </p>
            <p
              v-if="
                !validationError &&
                currentPage === book.totalPages &&
                book.totalPages > 0
              "
              class="text-xs font-semibold text-emerald-600 mt-1"
            >
              ✓ Đã hoàn thành cuốn sách (100%).
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
        >
          Hủy
        </button>
        <button
          type="button"
          @click="saveProgress"
          :disabled="isSubmitting || !!validationError"
          class="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 disabled:opacity-50 transition"
        >
          <span v-if="isSubmitting">Đang lưu...</span>
          <span v-else>Lưu tiến độ</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { type LibraryBook } from "@/types/libraryTypes";
import { X } from "lucide-vue-next";

const props = defineProps<{
  book: LibraryBook;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", payload: { currentPage: number }): void;
}>();

const currentPage = ref<number>(props.book.currentPage || 0);

// Tính phần trăm tiến độ đọc
const progressPercent = computed(() => {
  if (!props.book.totalPages || props.book.totalPages <= 0) return 0;
  const pct = (currentPage.value / props.book.totalPages) * 100;
  return Math.min(100, Math.max(0, Math.round(pct)));
});

// Validation phía Client: 0 <= currentPage <= totalPages
const validationError = computed(() => {
  if (currentPage.value < 0) {
    return "Số trang không được nhỏ hơn 0.";
  }
  if (props.book.totalPages > 0 && currentPage.value > props.book.totalPages) {
    return `Số trang không được vượt quá tổng số trang (${props.book.totalPages}).`;
  }
  return null;
});

const saveProgress = () => {
  if (validationError.value) return;

  emit("save", {
    currentPage: currentPage.value,
  });
};
</script>
