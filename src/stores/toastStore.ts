import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    toasts.value.push({ id, type, message });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const success = (message: string) => addToast(message, 'success');
  const error = (message: string) => addToast(message, 'error');
  const info = (message: string) => addToast(message, 'info');

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  };
});
