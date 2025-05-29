# Usa imagen oficial de Playwright que ya incluye Chromium y todas las deps
FROM mcr.microsoft.com/playwright:v1.52.0-jammy

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto usado por Express
EXPOSE 3000

# Comando para arrancar tu servidor
CMD ["node", "server.js"]