FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04 AS base

# Dépendances de base + FFmpeg (build Ubuntu inclut NVENC si drivers présents)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		 ca-certificates curl ffmpeg \
	&& rm -rf /var/lib/apt/lists/*

# Installer Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&& apt-get install -y --no-install-recommends nodejs \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier package.json
COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Installer les dépendances
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copier le code source
COPY . .

# Build du client
RUN cd client && npm run build

# Build du serveur
RUN cd server && npm run build

# Créer les dossiers nécessaires
RUN mkdir -p /app/server/uploads /app/server/output

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
