<template>
  <div class="w-full space-y-1.5">
    <div class="flex items-center justify-between text-xs font-semibold">
      <span class="text-slate-600">
        {{ currentPage }} / {{ totalPages }} trang
      </span>
      <span
        class="font-bold"
        :class="percent === 100 ? 'text-emerald-600' : 'text-indigo-600'"
      >
        {{ percent }}%
      </span>
    </div>
    <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="percent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calculateProgress } from '@/utils/formatters';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const percent = computed(() => calculateProgress(props.currentPage, props.totalPages));
</script>
