<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 transform transition-all max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-100"
      >
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-indigo-600" />
          <span>Thông tin chi tiết cuốn sách</span>
        </h3>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Book Details -->
      <div
        class="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100"
      >
        <div class="w-24 sm:w-28 shrink-0 self-center sm:self-start">
          <img
            :src="book.coverUrl || '/placeholder-cover.svg'"
            @error="handleImageError"
            :alt="book.title"
            class="w-full aspect-[2/3] object-cover rounded-xl shadow-md border border-slate-200/80"
          />
        </div>

        <div class="min-w-0 flex-1 flex flex-col gap-2.5">
          <div>
            <h4
              class="font-bold text-base text-slate-900 leading-snug line-clamp-2"
              :title="book.title"
            >
              {{ book.title }}
            </h4>
            <p class="text-xs font-semibold text-indigo-600 mt-1">
              {{ book.author || "Chưa rõ tác giả" }}
            </p>
          </div>

          <!-- Meta badges (Năm xuất bản, Số trang, Bắt đầu đọc, Đọc xong) -->
          <div class="flex flex-wrap gap-1.5 text-xs">
            <span
              class="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium flex items-center gap-1 shadow-2xs"
            >
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              <span>Xuất bản: {{ book.publishYear || "N/A" }}</span>
            </span>
            <span
              class="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium flex items-center gap-1 shadow-2xs"
            >
              <BookOpen class="w-3.5 h-3.5 text-slate-400" />
              <span>
                {{
                  book.totalPages
                    ? `${book.totalPages} trang`
                    : "Chưa rõ số trang"
                }}
              </span>
            </span>
          </div>

          <!-- Subjects -->
          <div
            v-if="book.subjects && book.subjects.length > 0"
            class="space-y-1"
          >
            <span
              class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block"
            >
              Chủ đề:
            </span>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(sub, idx) in book.subjects.slice(0, 5)"
                :key="idx"
                class="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-medium"
              >
                {{ sub }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1 pt-0.5">
            <span
              class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block"
            >
              Mô tả:
            </span>
            <p
              class="text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto pr-1"
            >
              {{
                book.description ||
                "Chưa có thông tin mô tả chi tiết cho cuốn sách này."
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div
        class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100"
      >
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LibraryBook } from "@/types/libraryTypes";
import { X, BookOpen, Calendar, CheckCircle2 } from "lucide-vue-next";

defineProps<{
  book: LibraryBook;
}>();

defineEmits<{
  (e: "close"): void;
}>();

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
