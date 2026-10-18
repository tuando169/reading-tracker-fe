<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div
      class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 transform transition-all"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookPlus class="w-5 h-5 text-indigo-600" />
          <span>Thêm sách vào tủ</span>
        </h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Book brief -->
      <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
        <img
          :src="book.coverUrl || '/placeholder-cover.svg'"
          @error="handleImageError"
          :alt="book.title"
          class="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
        />
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-sm text-slate-900 truncate">{{ book.title }}</h4>
          <p class="text-xs text-slate-500 truncate">{{ book.author }}</p>
        </div>
      </div>

      <!-- Status Selection -->
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Chọn trạng thái đọc ban đầu:
        </label>
        <div class="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            v-for="opt in statusOptions"
            :key="opt.value"
            @click="selectedStatus = opt.value"
            class="flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition text-left"
            :class="selectedStatus === opt.value
              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm'
              : 'border-slate-200 hover:border-slate-300 text-slate-700'"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full" :class="opt.color"></span>
              <span>{{ opt.label }}</span>
            </div>
            <Check v-if="selectedStatus === opt.value" class="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      <!-- Action buttons -->
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
          @click="confirmAdd"
          :disabled="isSubmitting"
          class="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 disabled:opacity-50 transition flex items-center gap-2"
        >
          <span v-if="isSubmitting">Đang lưu...</span>
          <span v-else>Xác nhận thêm</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ReadingStatus, type BookItem } from '@/types';
import { BookPlus, X, Check } from 'lucide-vue-next';

defineProps<{
  book: BookItem;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', status: ReadingStatus): void;
}>();

const selectedStatus = ref<ReadingStatus>(ReadingStatus.NOT_READ);

const statusOptions = [
  { value: ReadingStatus.NOT_READ, label: 'Muốn đọc (Chưa đọc)', color: 'bg-amber-400' },
  { value: ReadingStatus.READING, label: 'Đang đọc', color: 'bg-blue-500' },
  { value: ReadingStatus.COMPLETED, label: 'Đã đọc xong', color: 'bg-emerald-500' }
];

const confirmAdd = () => {
  emit('confirm', selectedStatus.value);
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = '/placeholder-cover.svg';
};
</script>
