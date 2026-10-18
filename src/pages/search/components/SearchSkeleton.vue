<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <div
      v-for="i in 12"
      :key="i"
      class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col"
    >
      <div class="aspect-square bg-slate-200 w-full"></div>
      <div class="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div class="space-y-1.5">
          <div class="h-3.5 bg-slate-200 rounded w-4/5"></div>
          <div class="h-2.5 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div class="h-7 bg-slate-200 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
</template>
