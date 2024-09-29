# Base image
FROM node:alpine

# Set working directory
WORKDIR /app

COPY package*.json ./

RUN npm cache clean -f
RUN npm install

COPY . ./

# Build
RUN npm run build

EXPOSE 3000

# Run the Node.js server using the compiled JS files
CMD ["npm", "run", "start"]
