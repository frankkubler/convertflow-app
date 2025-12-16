
<template>
  <div class="min-h-screen gradient-bg text-gray-900 dark:text-gray-100">
    <Navbar />
    <main class="max-w-5xl mx-auto p-4">
      <div class="glass-card p-6 mt-8 animate-fadeInScale">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
    <footer class="w-full border-t border-gray-200 dark:border-gray-800 py-6 mt-16 text-center text-gray-500 text-sm bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
      <div class="max-w-5xl mx-auto">
        <span class="font-semibold text-gray-700 dark:text-gray-200">ConvertFlow v2.0</span> &mdash; Conversion média professionnelle avec FFmpeg
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
/* Les animations et utilitaires sont dans style.css */
</style>
