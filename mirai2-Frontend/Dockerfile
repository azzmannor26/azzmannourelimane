# Base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port used by Vite (default is 5173)
EXPOSE 5173

# Start the app using Vite
CMD ["npm", "run", "dev", "--", "--host"]