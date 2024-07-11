# Stage 1: Build Stage
FROM node:21-alpine as build-stage

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy all files
COPY . .

# Build the application
RUN yarn build


# Sets the image to use
FROM nginx:latest

## Copy the current app version to the nginx container
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the nginx configuration file to the container
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]

