# --- Stage 1: Build the Frontend ---
    FROM node:lts-alpine3.19 AS frontend-build

    WORKDIR /app
    
    # Install dependencies
    COPY frontend/package.json frontend/package-lock.json ./
    RUN npm install
    
    # Copy frontend source files
    COPY frontend/tailwind.config.js ./tailwind.config.js
    COPY frontend/src ./src
    COPY frontend/public ./public
    
    # Build the frontend
    RUN npm run build
    
    # --- Stage 2: Final Image with Frontend + Signaling Server ---
    FROM node:alpine3.19 AS final
    
    # Install nginx and supervisor
    RUN apk add --no-cache nginx supervisor
    
    # ---------------- Setup Frontend ----------------
    # Copy frontend build to nginx's default static directory
    COPY --from=frontend-build /app/build /var/www/static
    
    # Copy custom nginx config
    COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
    
    # ---------------- Setup Signaling Server ----------------
    WORKDIR /app/signaling
    
    COPY signaling-server/package.json signaling-server/package-lock.json ./
    RUN npm install
    
    COPY signaling-server/index.js .
    
    # ---------------- Setup Supervisor ----------------
    COPY supervisord.conf /etc/supervisord.conf
    
    # Expose ports:
    # 80 for frontend (nginx)
    # 8001 for signaling server
    EXPOSE 80 8001
    
    # Start supervisor (runs both nginx and signaling server)
    CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
    