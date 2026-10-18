<template>
  <div
    class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
  >
    <!-- Cover -->
    <div
      @click="$emit('view-detail', book)"
      class="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer"
    >
      <img
        :src="book.coverUrl || '/placeholder-cover.svg'"
        :alt="book.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <span
          class="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-bold text-slate-900 shadow"
        >
          Chi tiết
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="p-3 flex-1 flex flex-col justify-between gap-2">
      <div>
        <h4
          @click="$emit('view-detail', book)"
          class="font-semibold text-xs text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 transition cursor-pointer"
          :title="book.title"
        >
          {{ book.title }}
        </h4>
        <p class="text-[11px] text-slate-500 font-medium truncate mt-0.5">
          {{ book.author || "Chưa rõ tác giả" }}
        </p>
        <p class="text-[10px] text-slate-400 font-medium mt-0.5">
          {{ book.publishYear ? `Xuất bản: ${book.publishYear}` : "" }}
        </p>
      </div>

      <!-- Action Button -->
      <div class="pt-1">
        <div
          v-if="book.inLibrary"
          class="w-full py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center justify-center gap-1 cursor-default select-none"
        >
          <Check class="w-3 h-3" />
          <span>Đã có trong tủ</span>
        </div>
        <button
          v-else
          @click="$emit('add-to-library', book)"
          class="w-full py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-xs"
        >
          <Plus class="w-3 h-3" />
          <span>Thêm vào tủ</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookItem } from "@/types/bookTypes";
import { Plus, Check } from "lucide-vue-next";

defineProps<{
  book: BookItem;
}>();

defineEmits<{
  (e: "view-detail", book: BookItem): void;
  (e: "add-to-library", book: BookItem): void;
}>();

</script>
