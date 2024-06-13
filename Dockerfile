# Sets the image to use
FROM nginx:latest

## Copy the current app version to the nginx container
COPY ./dist /usr/share/nginx/html

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]

