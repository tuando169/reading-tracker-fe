<template>
  <div
    class="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl w-full sm:w-auto overflow-x-auto"
  >
    <button
      v-for="tab in tabs"
      :key="String(tab.value)"
      @click="$emit('update:modelValue', tab.value)"
      class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5"
      :class="
        modelValue === tab.value
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
      "
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        class="text-[11px] px-1.5 py-0.2 rounded-full"
        :class="
          modelValue === tab.value
            ? 'bg-slate-100 text-slate-700 font-semibold'
            : 'text-slate-500'
        "
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type LibraryStats } from "@/types/libraryTypes";
import {
  ReadingStatusEnum,
  readingStatusOptions,
} from "@/constants/readingStatus";

const props = defineProps<{
  modelValue: ReadingStatusEnum | null;
  stats: LibraryStats;
}>();

defineEmits<{
  (e: "update:modelValue", val: ReadingStatusEnum | null): void;
}>();

const tabs = computed(() => [
  { label: "Tất cả sách", value: null, count: props.stats.totalBooks },
  {
    label: readingStatusOptions.find((r) => r.id === ReadingStatusEnum.NotRead)
      ?.label,
    value: ReadingStatusEnum.NotRead,
    count:
      props.stats.totalBooks -
      props.stats.readingBooks -
      props.stats.finishedBooks,
  },
  {
    label: readingStatusOptions.find((r) => r.id === ReadingStatusEnum.Reading)
      ?.label,
    value: ReadingStatusEnum.Reading,
    count: props.stats.readingBooks,
  },
  {
    label: readingStatusOptions.find(
      (r) => r.id === ReadingStatusEnum.Completed,
    )?.label,
    value: ReadingStatusEnum.Completed,
    count: props.stats.finishedBooks,
  },
]);
</script>
