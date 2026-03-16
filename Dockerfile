# Use official node image
FROM node:20

# App directory
WORKDIR /server

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]