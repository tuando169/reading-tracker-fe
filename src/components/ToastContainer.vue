<template>
  <div class="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
    <transition-group
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 bg-white"
        :class="{
          'border-emerald-200 text-emerald-900 bg-emerald-50/90': toast.type === 'success',
          'border-rose-200 text-rose-900 bg-rose-50/90': toast.type === 'error',
          'border-indigo-200 text-indigo-900 bg-indigo-50/90': toast.type === 'info',
        }"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <Info v-else class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />

        <div class="flex-1 text-sm font-medium">
          {{ toast.message }}
        </div>

        <button
          @click="removeToast(toast.id)"
          class="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToastStore } from '@/stores/toastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next';

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);
const removeToast = (id: number) => toastStore.removeToast(id);
</script>
