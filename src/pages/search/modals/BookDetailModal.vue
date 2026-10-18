<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div
      class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-5 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-800">Thông tin chi tiết cuốn sách</h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto flex-1">
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
          <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-semibold text-slate-500">Đang tải thông tin sách...</p>
        </div>

        <div v-else-if="book" class="flex flex-col sm:flex-row gap-6">
          <!-- Cover -->
          <div class="w-full sm:w-48 shrink-0 flex flex-col items-center">
            <img
              :src="book.coverUrl || '/placeholder-cover.svg'"
              @error="handleImageError"
              :alt="book.title"
              class="w-40 sm:w-full aspect-[2/3] object-cover rounded-2xl shadow-md border border-slate-100"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 flex flex-col justify-between">
            <div class="space-y-4">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {{ book.title }}
                </h2>
                <p class="text-sm font-semibold text-indigo-600 mt-1">
                  Tác giả: {{ book.author || 'Chưa rõ tác giả' }}
                </p>
              </div>

              <!-- Meta pills -->
              <div class="flex flex-wrap gap-2 text-xs font-semibold">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                  Năm xuất bản: {{ book.publishYear || 'N/A' }}
                </span>
                <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                  Tổng số trang: {{ book.totalPages ? `${book.totalPages} trang` : 'Đang cập nhật' }}
                </span>
              </div>

              <!-- Subjects -->
              <div v-if="book.subjects && book.subjects.length > 0" class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Chủ đề:</label>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(sub, idx) in book.subjects.slice(0, 8)"
                    :key="idx"
                    class="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium"
                  >
                    {{ sub }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả nội dung:</label>
                <p class="text-sm text-slate-600 leading-relaxed max-h-40 overflow-y-auto pr-1">
                  {{ book.description || 'Chưa có thông tin mô tả chi tiết cho cuốn sách này.' }}
                </p>
              </div>
            </div>

            <!-- Footer Action -->
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div v-if="book.isInLibrary" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                <Check class="w-4 h-4" />
                <span>Đã có trong tủ sách</span>
              </div>
              <button
                v-else
                @click="$emit('add-to-library', book)"
                class="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition flex items-center gap-2"
              >
                <Plus class="w-4 h-4" />
                <span>Thêm vào tủ sách</span>
              </button>

              <button
                @click="$emit('close')"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookDetail, BookItem } from '@/types';
import { X, Check, Plus } from 'lucide-vue-next';

defineProps<{
  book: BookDetail | null;
  isLoading?: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'add-to-library', book: BookItem): void;
}>();

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/placeholder-cover.svg';
};
</script>
