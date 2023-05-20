# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY src ./src

# Expose the port on which the Node.js server will listen
EXPOSE 3020

# Define the command to run when the container starts
CMD ["node", "src/Server.js"]
