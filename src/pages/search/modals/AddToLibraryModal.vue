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
          <BookPlus class="w-5 h-5 text-indigo-600" />
          <span>{{
            book.inLibrary ? "Thông tin chi tiết cuốn sách" : "Thêm sách vào tủ"
          }}</span>
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
            :src="detail?.coverUrl || book.coverUrl || '/placeholder-cover.svg'"
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

          <!-- Meta badges (Năm xuất bản, Số trang) -->
          <div class="flex flex-wrap gap-1.5 text-xs">
            <span
              class="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium flex items-center gap-1 shadow-2xs"
            >
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              <span
                >Xuất bản:
                {{ (detail?.publishYear ?? book.publishYear) || "N/A" }}</span
              >
            </span>
            <span
              class="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium flex items-center gap-1 shadow-2xs"
            >
              <BookOpen class="w-3.5 h-3.5 text-slate-400" />
              <span>
                {{
                  detail?.totalPages
                    ? `${detail.totalPages} trang`
                    : "Chưa rõ số trang"
                }}
              </span>
            </span>
          </div>

          <!-- Subjects -->
          <div
            v-if="detail?.subjects && detail.subjects.length > 0"
            class="space-y-1"
          >
            <span
              class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block"
              >Chủ đề:</span
            >
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(sub, idx) in detail.subjects.slice(0, 5)"
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
              >Mô tả:</span
            >
            <p
              class="text-xs text-slate-600 leading-relaxed max-h-24 overflow-y-auto pr-1"
            >
              {{
                detail?.description ||
                "Chưa có thông tin mô tả chi tiết cho cuốn sách này."
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Status Selection (chỉ hiện khi sách chưa có trong tủ) -->
      <div v-if="!book.inLibrary" class="space-y-2">
        <label
          class="block text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          Chọn trạng thái đọc ban đầu:
        </label>
        <div class="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            v-for="opt in readingStatusOptions"
            :key="opt.id"
            @click="selectedStatus = opt.id"
            class="flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition text-left"
            :class="
              selectedStatus === opt.id
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            "
          >
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full" :class="opt.color"></span>
              <span>{{ opt.label }}</span>
            </div>
            <Check
              v-if="selectedStatus === opt.id"
              class="w-4 h-4 text-indigo-600"
            />
          </button>
        </div>
      </div>

      <div
        v-else
        class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold"
      >
        <Check class="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Cuốn sách này đã có trong tủ sách cá nhân của bạn.</span>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
        >
          {{ book.inLibrary ? "Đóng" : "Hủy" }}
        </button>
        <button
          v-if="!book.inLibrary"
          type="button"
          @click="confirmAdd"
          :disabled="isSubmitting"
          class="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 disabled:opacity-50 transition flex items-center gap-2"
        >
          <span v-if="isSubmitting">Đang lưu...</span>
          <span v-else>Xác nhận thêm</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { type BookItem, type BookDetail } from "@/types/bookTypes";
import { BookPlus, X, Check, Calendar, BookOpen } from "lucide-vue-next";
import {
  ReadingStatusEnum,
  readingStatusOptions,
} from "@/constants/readingStatus";

const props = defineProps<{
  book: BookItem;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", status: ReadingStatusEnum): void;
}>();

const detail = ref<BookDetail | null>(null);

const selectedStatus = ref<ReadingStatusEnum>(ReadingStatusEnum.NotRead);

onMounted(() => {
  detail.value = props.book as unknown as BookDetail;
});

const confirmAdd = () => {
  emit("confirm", selectedStatus.value);
};

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = "/placeholder-cover.svg";
};
</script>
