# Use Debian-based Node.js image instead of Alpine
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set Prisma binary targets for Alpine Linux
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

# Generate Prisma client for the correct platform
RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
