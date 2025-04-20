# --- Stage 1: Build the Frontend ---
    FROM node:lts-alpine3.19 AS frontend-build

    WORKDIR /app
    
    COPY frontend/package.json frontend/package-lock.json ./
    RUN npm install
    
    COPY frontend/tailwind.config.js ./tailwind.config.js
    COPY frontend/src ./src
    COPY frontend/public ./public
    
    RUN npm run build
    
    # --- Stage 2: Final Image with Frontend + Signaling Server ---
    FROM node:alpine3.19 AS final
    
    # Install nginx and supervisor
    RUN apk add --no-cache nginx supervisor
    
    # ---------------- Setup Frontend ----------------
    # Copy frontend build to nginx's static directory
    COPY --from=frontend-build /app/build /var/www/static
    
    # Remove default config and add custom nginx config
    RUN rm /etc/nginx/conf.d/default.conf
    COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
    
    # ---------------- Setup Signaling Server ----------------
    WORKDIR /app/signaling
    
    COPY signaling-server/package.json signaling-server/package-lock.json ./
    RUN npm install
    
    COPY signaling-server/index.js ./
    
    # ---------------- Setup Supervisor ----------------
    COPY supervisord.conf /etc/supervisord.conf
    
    # Expose frontend (80) and signaling server (8001)
    EXPOSE 80 8001
    
    CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
    