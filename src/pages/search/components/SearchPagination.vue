<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <!-- Nút phân trang -->
    <div class="flex items-center gap-2">
      <button
        @click="$emit('change-page', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-xs"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>Trang trước</span>
      </button>

      <div
        class="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs"
      >
        Trang {{ currentPage }} / {{ totalPages || 1 }}
      </div>

      <!-- Chọn số lượng trên mỗi trang (limit) -->
      <div
        class="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs"
      >
        <select
          id="limit-select"
          :value="limit"
          @change="onLimitChange"
          class="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option :value="10">10 / trang</option>
          <option :value="20">20 / trang</option>
          <option :value="50">50 / trang</option>
        </select>
      </div>

      <button
        @click="$emit('change-page', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-xs"
      >
        <span>Trang sau</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

withDefaults(
  defineProps<{
    currentPage: number;
    totalPages: number;
    limit?: number;
  }>(),
  {
    limit: 10,
  },
);

const emit = defineEmits<{
  (e: "change-page", page: number): void;
  (e: "change-limit", limit: number): void;
}>();

const onLimitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("change-limit", Number(target.value));
};
</script>
