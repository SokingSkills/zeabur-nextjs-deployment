FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY <<'EOF' /etc/caddy/Caddyfile
:80 {
    root * /usr/share/caddy
    try_files {path} /index.html
    file_server
    encode gzip
}
EOF
EXPOSE 80
