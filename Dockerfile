# Use an official Node.js runtime as a base image
#FROM node:18.17.1-alpine

# Set the working directory in the container
#WORKDIR /usr/src/cabinet2

# Copy package.json and package-lock.json to the container
#COPY package*.json ./

# Set NODE_OPTIONS environment variable to suppress deprecation warnings
#ENV NODE_OPTIONS="--no-deprecation"

# Install application dependencies
#RUN npm install
#RUN npm install -g typescript

# Copy the rest of your application code to the container
#COPY . .

# Expose the port your React application listens on
#EXPOSE 3006

# Define the command to start your React application
#CMD ["npm", "start"]



# Use an official Node.js runtime as a base image
FROM node:14.16.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/cabinet2

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Set NODE_OPTIONS environment variable to suppress deprecation warnings
ENV NODE_OPTIONS="--no-deprecation"

# Install application dependencies
RUN npm install --force

# Copy the rest of your application code to the container
COPY . .

# Expose the port your React application listens on
EXPOSE 3001

# Define the command to start your React application
CMD ["npm", "start"]
