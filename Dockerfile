FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Installer les dépendances
RUN npm install --production
RUN cd server && npm install --production
RUN cd client && npm install

# Copier le code source
COPY server ./server
COPY client ./client

# Build du client
RUN cd client && npm run build

# Build du serveur
RUN cd server && npm run build

# Créer les dossiers nécessaires
RUN mkdir -p /app/server/uploads /app/server/output

# Nettoyer les fichiers de dev
RUN cd client && rm -rf node_modules && npm install --production

EXPOSE 3000

CMD ["npm", "start"]
