<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Header -->
    <AppHeader />

    <!-- Main Container -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 font-medium">
      Mini Reading Tracker &copy; 2026 &bull; Do Dang Tuan
    </footer>

    <!-- Global Toast Alerts -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import { useLibraryStore } from '@/stores/libraryStore';

const libraryStore = useLibraryStore();

onMounted(() => {
  // Tải trước tủ sách để có thống kê hiển thị ngay trên header
  libraryStore.fetchLibraryBooks();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
