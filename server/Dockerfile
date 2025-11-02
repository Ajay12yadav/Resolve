# 1. Use official Node.js image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the backend code
COPY . .

# 6. Generate Prisma client
RUN npx prisma generate

# 7. Build TypeScript
RUN npm run build

# 8. Expose port (change if your backend uses a different port)
EXPOSE 4000

# 9. Start the server
CMD ["node", "dist/index.js"]