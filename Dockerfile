# 1. Use official Node.js image for build step
FROM node:20-alpine AS builder

WORKDIR /app

# 2. Copy package.json and package-lock.json
COPY package*.json ./

# 3. Install dependencies
RUN npm install

# 4. Copy the rest of the frontend code
COPY . .

# 5. Build the frontend (Vite)
RUN npm run build

# 6. Use official nginx image for serving static files
FROM nginx:alpine

# 7. Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. Expose port 80
EXPOSE 80

# 9. Start nginx
CMD ["nginx", "-g", "daemon off;"]