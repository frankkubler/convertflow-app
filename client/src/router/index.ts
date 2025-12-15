import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Converter from '@/views/Converter.vue';
import History from '@/views/History.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/converter',
      name: 'converter',
      component: Converter
    },
    {
      path: '/history',
      name: 'history',
      component: History
    }
  ]
});

export default router;
