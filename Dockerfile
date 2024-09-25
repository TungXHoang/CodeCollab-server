# Base image used  
FROM node:alpine 
WORKDIR /usr/src/index
COPY package*.json ./
# Install project dependencies
RUN npm install
EXPOSE 3000
COPY ./ ./
# Running default command
CMD ["npm", "run", "dev"]