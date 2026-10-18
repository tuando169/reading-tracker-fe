<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div
      class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center gap-4"
    >
      <div class="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
        <Trash2 class="w-7 h-7" />
      </div>

      <div class="space-y-1">
        <h3 class="text-base font-bold text-slate-900">Xóa sách khỏi tủ?</h3>
        <p class="text-xs text-slate-500 max-w-xs leading-relaxed">
          Bạn có chắc chắn muốn xóa cuốn sách <strong class="text-slate-800">"{{ bookTitle }}"</strong> khỏi tủ sách không? Thao tác này không thể hoàn tác.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 w-full mt-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          @click="$emit('confirm')"
          :disabled="isSubmitting"
          class="px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 disabled:opacity-50 transition"
        >
          <span v-if="isSubmitting">Đang xóa...</span>
          <span v-else>Xóa sách</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

defineProps<{
  bookTitle: string;
  isSubmitting?: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script>
