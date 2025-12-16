<template>
  <div class="max-w-7xl mx-auto">
    <!-- Hero Section -->
    <div class="hero min-h-[350px] bg-base-200 rounded-lg border border-base-300 mb-12">
      <div class="hero-content text-center">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            ConvertFlow
          </h1>
          <p class="text-lg md:text-xl mb-3 text-base-content/80">
            Convertisseur Média Professionnel
          </p>
          <p class="text-sm mb-6 text-base-content/60 max-w-2xl mx-auto">
            Solution auto-hébergée pour la conversion de fichiers multimédia avec FFmpeg.
          </p>
          <div class="flex flex-wrap gap-2 justify-center mb-6">
            <div class="badge">30+ Formats</div>
            <div class="badge">Open Source</div>
            <div class="badge">Sans Limites</div>
            <div class="badge">100% Privé</div>
          </div>
          <router-link to="/converter" class="btn btn-primary gap-2 px-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Commencer maintenant
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
        <div class="card-body items-center text-center">
          <svg class="w-12 h-12 mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h2 class="card-title text-xl mb-2">Conversion Vidéo</h2>
          <p class="text-base-content/60 mb-4 text-sm">Tous les formats vidéo professionnels</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span class="badge badge-primary badge-sm">MP4</span>
            <span class="badge badge-primary badge-sm">WebM</span>
            <span class="badge badge-primary badge-sm">MKV</span>
            <span class="badge badge-primary badge-sm">AVI</span>
            <span class="badge badge-primary badge-sm">MOV</span>
            <span class="badge badge-primary badge-sm">+10</span>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
        <div class="card-body items-center text-center">
          <svg class="w-12 h-12 mb-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h2 class="card-title text-xl mb-2">Conversion Audio</h2>
          <p class="text-base-content/60 mb-4 text-sm">Extraction et conversion audio haute qualité</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span class="badge badge-secondary badge-sm">MP3</span>
            <span class="badge badge-secondary badge-sm">AAC</span>
            <span class="badge badge-secondary badge-sm">FLAC</span>
            <span class="badge badge-secondary badge-sm">WAV</span>
            <span class="badge badge-secondary badge-sm">Opus</span>
            <span class="badge badge-secondary badge-sm">+5</span>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
        <div class="card-body items-center text-center">
          <svg class="w-12 h-12 mb-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 class="card-title text-xl mb-2">Ultra Performant</h2>
          <p class="text-base-content/60 mb-4 text-sm">Optimisé avec FFmpeg 8.0</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <span class="badge badge-accent badge-sm">Hardware Accel</span>
            <span class="badge badge-accent badge-sm">Multi-thread</span>
            <span class="badge badge-accent badge-sm">Temps réel</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fonctionnalités détaillées -->
    <div class="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300 mb-16">
      <div class="card-body p-8">
        <h2 class="text-3xl font-bold mb-8 text-center">
          <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🚀 Fonctionnalités Complètes
          </span>
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">📦</div>
            <div>
              <h3 class="font-bold text-lg mb-1">30+ Formats Supportés</h3>
              <p class="text-sm text-base-content/70">MP4, WebM, MKV, AVI, MOV, FLV, MP3, AAC, FLAC, WAV, Opus et plus</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">🎯</div>
            <div>
              <h3 class="font-bold text-lg mb-1">Extraction Audio</h3>
              <p class="text-sm text-base-content/70">Extrayez facilement l'audio de vos vidéos dans n'importe quel format</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">📊</div>
            <div>
              <h3 class="font-bold text-lg mb-1">Métadonnées Complètes</h3>
              <p class="text-sm text-base-content/70">Analysez tous les détails techniques de vos fichiers</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">✂️</div>
            <div>
              <h3 class="font-bold text-lg mb-1">Découpage & Trim</h3>
              <p class="text-sm text-base-content/70">Découpez vos vidéos avec précision temporelle</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">🖼️</div>
            <div>
              <h3 class="font-bold text-lg mb-1">Redimensionnement</h3>
              <p class="text-sm text-base-content/70">Ajustez les dimensions et la rotation de vos vidéos</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">🔒</div>
            <div>
              <h3 class="font-bold text-lg mb-1">100% Privé</h3>
              <p class="text-sm text-base-content/70">Auto-hébergé, vos fichiers restent chez vous</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">💎</div>
            <div>
              <h3 class="font-bold text-lg mb-1">Qualité Professionnelle</h3>
              <p class="text-sm text-base-content/70">Contrôle total sur les codecs et la qualité</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors">
            <div class="text-3xl">⚙️</div>
            <div>
              <h3 class="font-bold text-lg mb-1">Options Avancées</h3>
              <p class="text-sm text-base-content/70">Preset, tune, CRF, bitrate personnalisable</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Final -->
    <div class="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
      <h2 class="text-4xl font-bold mb-4">Prêt à convertir ?</h2>
      <p class="text-xl text-base-content/70 mb-8">Commencez dès maintenant, c'est gratuit et sans inscription</p>
      <router-link to="/converter" class="btn btn-primary btn-lg gap-3 shadow-xl hover:scale-105 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        Lancer une conversion
      </router-link>
    </div>
  </div>
</template>
