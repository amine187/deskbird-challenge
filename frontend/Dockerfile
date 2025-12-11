# syntax=docker/dockerfile:1

# Stage 1: Build Angular app
FROM node:20.19.3-slim AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.20.0

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all source files
COPY . .

# Build Angular app in production mode
RUN pnpm run build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d

# Copy built Angular app from build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose port 80 for Fly.io
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
