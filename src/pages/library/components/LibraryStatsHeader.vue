<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
    <!-- Card 1: Tổng số sách -->
    <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
        <BookOpen class="w-6 h-6" />
      </div>
      <div>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tổng số sách</span>
        <span class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {{ stats.totalBooks }}
        </span>
      </div>
    </div>

    <!-- Card 2: Đang đọc -->
    <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        <Clock class="w-6 h-6" />
      </div>
      <div>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Đang đọc</span>
        <span class="text-2xl sm:text-3xl font-extrabold text-blue-600 leading-tight">
          {{ stats.readingBooks }}
        </span>
      </div>
    </div>

    <!-- Card 3: Đã đọc xong -->
    <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <Trophy class="w-6 h-6" />
      </div>
      <div>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Đã đọc xong</span>
        <span class="text-2xl sm:text-3xl font-extrabold text-emerald-600 leading-tight">
          {{ stats.finishedBooks }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LibraryStats } from '@/types/libraryTypes';
import { BookOpen, Clock, Trophy } from 'lucide-vue-next';

defineProps<{
  stats: LibraryStats;
}>();
</script>
