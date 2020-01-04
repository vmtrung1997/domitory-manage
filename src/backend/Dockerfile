# Use a lighter version of Node as a parent image
FROM node:10

# Set the working directory to /api
WORKDIR /home/ktx-backend

# copy package.json into the container at /api
COPY package.json /home/ktx-backend/

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /api
COPY . /home/ktx-backend/

# Make port 80 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
