# Utiliser Node.js 18 Alpine (léger et sécurisé)
FROM node:19.6.0-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm i

# Copier le code source
COPY . .


# Exposer le port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "run", "dev"]