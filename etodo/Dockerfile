# --- STAGE 1: Build the React Frontend ---
FROM node:lts-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- STAGE 2: Set up the Backend Server ---
FROM node:lts-alpine
WORKDIR /usr/src/app

# Copy dependency mappings and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend files
COPY server.js ./

# Grab the freshly compiled React production assets from Stage 1
COPY --from=frontend-builder /app/build ./build

# Expose backend port
EXPOSE 5000

# Fire up the engine
CMD ["node", "server.js"]