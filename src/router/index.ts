import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import BookSearchPage from '@/pages/search/BookSearchPage.vue';
import MyLibraryPage from '@/pages/library/MyLibraryPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'BookSearch',
    component: BookSearchPage,
    meta: { title: 'Tìm kiếm sách — Mini Reading Tracker' }
  },
  {
    path: '/my-library',
    name: 'MyLibrary',
    component: MyLibraryPage,
    meta: { title: 'Tủ sách của tôi — Mini Reading Tracker' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Mini Reading Tracker';
});
