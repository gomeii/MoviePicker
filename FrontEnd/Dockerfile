# Use an official node image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Build the React app
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Set the command to serve the app
CMD ["serve", "-s", "build", "-l", "3000"]