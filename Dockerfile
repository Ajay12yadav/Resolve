# 1. Build step with Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Pass API URL into the build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Build Vite app using correct API URL
RUN npm run build

# 2. Nginx serve step
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
