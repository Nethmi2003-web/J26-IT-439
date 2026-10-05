# Use official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist ./dist

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
