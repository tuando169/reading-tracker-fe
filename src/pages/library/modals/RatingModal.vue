<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-900">Đánh giá & Ghi chú</h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Title -->
      <div class="text-sm font-semibold text-slate-800">
        {{ book.title }}
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Star rating -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-600">Đánh giá sách (1-5 sao):</label>
          <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <StarRating v-model="rating" :show-label="true" />
            <button
              v-if="rating > 0"
              @click="rating = 0"
              class="text-xs text-rose-500 font-semibold hover:underline ml-auto"
            >
              Bỏ đánh giá
            </button>
          </div>
        </div>

        <!-- Note -->
        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-600">Ghi chú cá nhân:</label>
          <textarea
            v-model="note"
            rows="3"
            placeholder="Viết cảm nhận hoặc bài học ngắn sau khi đọc..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
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
          @click="saveRating"
          :disabled="isSubmitting"
          class="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 disabled:opacity-50 transition"
        >
          <span v-if="isSubmitting">Đang lưu...</span>
          <span v-else>Lưu đánh giá</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { LibraryBook } from '@/types';
import StarRating from '../components/StarRating.vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  book: LibraryBook;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: { rating: number; note: string }): void;
}>();

const rating = ref<number>(props.book.rating || 0);
const note = ref<string>(props.book.note || '');

const saveRating = () => {
  emit('save', {
    rating: rating.value,
    note: note.value.trim()
  });
};
</script>
