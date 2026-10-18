<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
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
        <!-- Input số trang -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-600">
            Số trang hiện tại (tối đa {{ book.totalPages }} trang):
          </label>
          <div class="relative">
            <input
              type="number"
              v-model.number="currentPage"
              :min="0"
              :max="book.totalPages"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400">
              / {{ book.totalPages }} trang
            </span>
          </div>
          <!-- Validation warning -->
          <p v-if="validationError" class="text-xs font-medium text-rose-600 mt-1">
            {{ validationError }}
          </p>
          <p v-else-if="currentPage === book.totalPages && book.totalPages > 0" class="text-xs font-semibold text-emerald-600 mt-1">
            ✓ Đã đọc đủ số trang. Sách sẽ tự động chuyển sang "Đã đọc xong".
          </p>
        </div>

        <!-- Trạng thái -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-600">Trạng thái đọc:</label>
          <select
            v-model.number="status"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option :value="ReadingStatus.NOT_READ">Muốn đọc (Chưa đọc)</option>
            <option :value="ReadingStatus.READING">Đang đọc</option>
            <option :value="ReadingStatus.COMPLETED">Đã đọc xong</option>
          </select>
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
import { ref, computed, watch } from 'vue';
import { ReadingStatus, type LibraryBook } from '@/types';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  book: LibraryBook;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: { currentPage: number; status: ReadingStatus }): void;
}>();

const currentPage = ref<number>(props.book.currentPage || 0);
const status = ref<ReadingStatus>(props.book.status);

// Validation phía Client: 0 <= currentPage <= totalPages
const validationError = computed(() => {
  if (currentPage.value < 0) {
    return 'Số trang không được nhỏ hơn 0.';
  }
  if (props.book.totalPages > 0 && currentPage.value > props.book.totalPages) {
    return `Số trang không được vượt quá tổng số trang (${props.book.totalPages}).`;
  }
  return null;
});

// Tự động chuyển COMPLETED khi đọc hết số trang
watch(currentPage, (val) => {
  if (props.book.totalPages > 0 && val >= props.book.totalPages) {
    status.value = ReadingStatus.COMPLETED;
  }
});

const saveProgress = () => {
  if (validationError.value) return;
  emit('save', {
    currentPage: currentPage.value,
    status: status.value
  });
};
</script>
