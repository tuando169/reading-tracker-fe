<template>
  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4 p-4 group">
    <!-- Cover -->
    <div class="w-full sm:w-28 sm:h-40 shrink-0 aspect-[2/3] sm:aspect-auto rounded-xl overflow-hidden bg-slate-100 shadow-inner">
      <img
        :src="book.coverUrl"
        @error="handleImageError"
        :alt="book.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col justify-between gap-3 min-w-0">
      <!-- Title & Badge -->
      <div>
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-bold text-base text-slate-900 leading-snug truncate" :title="book.title">
            {{ book.title }}
          </h4>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0"
            :class="getStatusBadgeClass(book.status)"
          >
            {{ getStatusLabel(book.status) }}
          </span>
        </div>
        <p class="text-xs text-slate-500 font-medium truncate mt-0.5">
          {{ book.author || 'Chưa rõ tác giả' }}
        </p>
      </div>

      <!-- Progress bar -->
      <ProgressBar
        :current-page="book.currentPage"
        :total-pages="book.totalPages"
      />

      <!-- Rating & Note preview -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
        <StarRating :model-value="book.rating" :readonly="true" :show-label="true" />

        <div v-if="book.note" class="text-slate-500 italic truncate max-w-[200px]" :title="book.note">
          "{{ book.note }}"
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-1">
        <button
          @click="$emit('update-progress', book)"
          class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <BookOpen class="w-3.5 h-3.5 text-indigo-600" />
          <span>Tiến độ</span>
        </button>

        <button
          @click="$emit('rate-note', book)"
          class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Star class="w-3.5 h-3.5 text-amber-500" />
          <span>Đánh giá / Ghi chú</span>
        </button>

        <button
          @click="$emit('remove', book)"
          class="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
          title="Xóa khỏi tủ sách"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LibraryBook } from '@/types';
import { useBookStatus } from '@/composables/useBookStatus';
import ProgressBar from './ProgressBar.vue';
import StarRating from './StarRating.vue';
import { BookOpen, Star, Trash2 } from 'lucide-vue-next';

defineProps<{
  book: LibraryBook;
}>();

defineEmits<{
  (e: 'update-progress', book: LibraryBook): void;
  (e: 'rate-note', book: LibraryBook): void;
  (e: 'remove', book: LibraryBook): void;
}>();

const { getStatusLabel, getStatusBadgeClass } = useBookStatus();

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/placeholder-cover.svg';
};
</script>
