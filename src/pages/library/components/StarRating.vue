<template>
  <div class="flex items-center gap-1">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      @click="onSelect(star)"
      class="transition-transform p-0.5 focus:outline-none"
      :class="[
        readonly ? 'cursor-default' : 'hover:scale-110 cursor-pointer',
      ]"
    >
      <Star
        class="w-4 h-4"
        :class="star <= modelValue ? 'text-amber-400 fill-amber-400' : 'text-slate-300'"
      />
    </button>
    <span v-if="showLabel" class="text-xs font-semibold text-slate-500 ml-1">
      {{ modelValue > 0 ? `${modelValue}/5 sao` : 'Chưa đánh giá' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    readonly?: boolean;
    showLabel?: boolean;
  }>(),
  {
    modelValue: 0,
    readonly: false,
    showLabel: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
}>();

const onSelect = (star: number) => {
  if (props.readonly) return;
  // Bấm vào ngôi sao hiện tại thì bỏ đánh giá (về 0)
  if (props.modelValue === star) {
    emit('update:modelValue', 0);
  } else {
    emit('update:modelValue', star);
  }
};
</script>
