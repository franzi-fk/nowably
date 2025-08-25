# use debian-based node for best compatibility
FROM node:22.16-slim 

# set working directory
WORKDIR /app

# copy package files and install dependencies
COPY package*.json ./
RUN npm install

# copy project files
COPY . .

# expose used port 
EXPOSE 8888

# command to run the dev server
CMD ["npm", "run", "dev"]
