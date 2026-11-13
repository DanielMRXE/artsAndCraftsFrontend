# Etapa de Compilación
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Etapa de Servidor Web Ultraligero NGINX
FROM nginx:alpine AS final

ENV PORT=80

COPY --from=build /app/dist/florymas-web/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
