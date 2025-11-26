# Use Debian-based Node image (not Alpine!)
FROM node:20-slim

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apt-get update && apt-get install -y openssl

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
