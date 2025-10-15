FROM node:18-alpine as build

WORKDIR /app
RUN apk add --no-cache python3 make g++

# 👉 clave: que aplique durante el build de webpack 4
ENV NODE_OPTIONS="--openssl-legacy-provider"

COPY . .

# Convierte CRLF -> LF recursivo
RUN find /app -type f -exec dos2unix {} \;

# Autoformatea el código (opcional pero útil en CI)
RUN yarn format || true

RUN yarn
RUN yarn build

#---

FROM nginx:alpine

COPY --from=build /app/build/ /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80