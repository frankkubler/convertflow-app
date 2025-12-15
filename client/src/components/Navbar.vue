<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="container mx-auto">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost text-xl">
          🐰 MediaBunny
        </router-link>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/">Accueil</router-link></li>
          <li><router-link to="/converter">Convertir</router-link></li>
          <li><router-link to="/history">Historique</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>
