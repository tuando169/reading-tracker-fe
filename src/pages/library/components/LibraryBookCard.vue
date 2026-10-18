<template>
  <div
    class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4 p-4 group"
  >
    <!-- Cover with Hover Chi tiết overlay -->
    <div
      @click="$emit('view-detail', book)"
      class="relative w-full sm:w-28 sm:h-44 shrink-0 aspect-[2/3] sm:aspect-auto rounded-xl overflow-hidden bg-slate-100 shadow-inner cursor-pointer"
    >
      <img
        :src="book.coverUrl"
        @error="handleImageError"
        :alt="book.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <!-- Hover Overlay tương tự BookCard bên search -->
      <div
        class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <span
          class="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-bold text-slate-900 shadow"
        >
          Chi tiết
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col justify-between gap-3 min-w-0">
      <!-- Title & Badge -->
      <div>
        <div class="flex items-start justify-between gap-2">
          <h4
            @click="$emit('view-detail', book)"
            class="font-bold text-base text-slate-900 leading-snug truncate hover:text-indigo-600 transition cursor-pointer"
            :title="book.title"
          >
            {{ book.title }}
          </h4>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0"
            :class="getStatusBadgeClass(book.status)"
          >
            {{ getStatusLabel(book.status) }}
          </span>
        </div>
        <p class="text-xs text-slate-500 font-medium truncate mt-0.5">
          {{ book.author || "Chưa rõ tác giả" }}
        </p>

        <!-- Thời gian bắt đầu đọc / đọc xong nếu có -->
        <div
          v-if="book.startedAt || book.finishedAt"
          class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500"
        >
          <div v-if="book.startedAt" class="flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span
              >Bắt đầu:
              <strong class="text-slate-700 font-semibold">{{
                formatDate(book.startedAt)
              }}</strong></span
            >
          </div>

          <div v-if="book.finishedAt" class="flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span
              >Đọc xong:
              <strong class="text-slate-700 font-semibold">{{
                formatDate(book.finishedAt)
              }}</strong></span
            >
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <ProgressBar
        :current-page="book.currentPage"
        :total-pages="book.totalPages || 0"
      />

      <!-- Rating & Note preview -->
      <div
        class="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100"
      >
        <StarRating
          :model-value="book.rating"
          :readonly="true"
          :show-label="true"
        />

        <div
          v-if="book.note"
          class="text-slate-500 italic truncate max-w-[200px]"
          :title="book.note"
        >
          "{{ book.note }}"
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-1">
        <button
          @click="$emit('update-progress', book)"
          class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <BookOpen class="w-3.5 h-3.5 text-indigo-600" />
          <span>Tiến độ</span>
        </button>

        <button
          @click="$emit('rate-note', book)"
          class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Star class="w-3.5 h-3.5 text-amber-500" />
          <span>Đánh giá / Ghi chú</span>
        </button>

        <button
          @click="$emit('remove', book)"
          class="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
          title="Xóa khỏi tủ sách"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LibraryBook } from "@/types/libraryTypes";
import { readingStatusOptions } from "@/constants/readingStatus";
import ProgressBar from "./ProgressBar.vue";
import StarRating from "./StarRating.vue";
import {
  BookOpen,
  Star,
  Trash2,
  Calendar,
  CheckCircle2,
} from "lucide-vue-next";

defineProps<{
  book: LibraryBook;
}>();

defineEmits<{
  (e: "view-detail", book: LibraryBook): void;
  (e: "update-progress", book: LibraryBook): void;
  (e: "rate-note", book: LibraryBook): void;
  (e: "remove", book: LibraryBook): void;
}>();

const getStatusBadgeClass = (status: number) => {
  return (
    readingStatusOptions.find((o) => o.id === status)?.badgeClass ??
    "bg-slate-100 text-slate-800 border-slate-200"
  );
};

const getStatusLabel = (status: number) => {
  return (
    readingStatusOptions.find((o) => o.id === status)?.label ?? "Chưa xác định"
  );
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = "/placeholder-cover.svg";
};
</script>
