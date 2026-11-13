# Etapa de Compilación
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Etapa de Servidor Web Ultraligero NGINX
FROM nginx:alpine AS final
COPY --from=build /app/dist/florymas-web/browser /usr/share/nginx/html

# Configuración NGINX para SPA (Angular Routing)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
