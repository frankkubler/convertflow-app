<template>
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12 text-white">
      <h1 class="text-5xl font-bold mb-4">🐰 MediaBunny App</h1>
      <p class="text-xl opacity-90">
        Outil de conversion média auto-hébergé et performant
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body text-center">
          <div class="text-4xl mb-4">🎬</div>
          <h2 class="card-title justify-center">Conversion Vidéo</h2>
          <p>MP4, WebM, MOV, MKV</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body text-center">
          <div class="text-4xl mb-4">🎵</div>
          <h2 class="card-title justify-center">Conversion Audio</h2>
          <p>MP3, WAV, OGG, FLAC</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body text-center">
          <div class="text-4xl mb-4">⚡</div>
          <h2 class="card-title justify-center">Ultra Rapide</h2>
          <p>Traitement optimisé</p>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Fonctionnalités</h2>
        <ul class="list-disc list-inside space-y-2">
          <li>Conversion entre formats multiples (MP4, WebM, MP3, WAV, etc.)</li>
          <li>Extraction audio depuis vidéo</li>
          <li>Analyse complète des métadonnées</li>
          <li>Découpage et trim de médias</li>
          <li>Redimensionnement vidéo</li>
          <li>Auto-hébergement complet</li>
          <li>Interface moderne et réactive</li>
          <li>Traitement côté serveur pour de meilleures performances</li>
        </ul>
        
        <div class="card-actions justify-center mt-6">
          <router-link to="/converter" class="btn btn-primary btn-lg">
            Commencer une conversion
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
