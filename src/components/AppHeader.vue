<template>
  <header
    class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200"
  >
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
    >
      <!-- Logo & Tiêu đề -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform"
        >
          <BookOpen class="w-5 h-5" />
        </div>
        <div>
          <span
            class="font-bold text-slate-900 tracking-tight block leading-tight"
            >Reading
          </span>
          <span
            class="font-bold text-slate-900 tracking-tight block leading-tight"
            >Tracker
          </span>
        </div>
      </router-link>

      <!-- Navigation Links -->
      <nav class="flex items-center gap-2">
        <router-link
          to="/"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          :class="
            $route.path === '/'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          "
        >
          <Search class="w-4 h-4" />
          <span>Tìm sách</span>
        </router-link>

        <router-link
          to="/my-library"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors relative"
          :class="
            $route.path === '/my-library'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          "
        >
          <Library class="w-4 h-4" />
          <span>Tủ sách của tôi</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BookOpen, Search, Library } from "lucide-vue-next";
</script>
