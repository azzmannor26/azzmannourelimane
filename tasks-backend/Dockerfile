# Étape 1 : image de base
FROM node:18-alpine
# Définir le répertoire de travail
WORKDIR /app
# Copier les fichiers package
COPY package*.json ./
# Installer les dépendances
RUN npm install
# Copier le reste des fichiers
COPY . .
# Exposer le port
EXPOSE 5000
# Lancer l'app
CMD ["npm", "start"]