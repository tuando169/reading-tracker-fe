<template>
  <div class="relative w-full">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search class="w-5 h-5" />
      </div>
      <input
        type="text"
        :value="modelValue"
        @input="onInput"
        placeholder="Tìm kiếm theo tên sách hoặc tác giả (tối thiểu 3 ký tự)..."
        class="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 font-medium transition"
      />
      <button
        v-if="modelValue"
        @click="clearInput"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';
import { useDebounce } from '@/composables/useDebounce';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'search', val: string): void;
}>();

const debouncedSearch = useDebounce((val: string) => {
  emit('search', val);
}, 400);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = target.value;
  emit('update:modelValue', val);
  debouncedSearch(val);
};

const clearInput = () => {
  emit('update:modelValue', '');
  emit('search', '');
};
</script>
