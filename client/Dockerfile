# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json ./
COPY yarn.lock ./

# Install the app's dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the app's files to the container
COPY . .

# Serve the app on port 80
EXPOSE 3000
CMD ["yarn", "start"]
