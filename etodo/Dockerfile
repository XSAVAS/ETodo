FROM node:lts-alpine

WORKDIR /usr/src/app

# Copy dependency mappings
COPY package*.json ./

# Install ALL dependencies (avoids breaking if dev-tools are required by the AI scripts)
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Run the backend file directly to prevent npm lifecycle wrap issues
CMD ["node", "server.js"]