FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/buddies
WORKDIR /usr/src/buddies

# Install app dependencies
COPY package.json /usr/src/buddies/
RUN npm install

# Bundle app source
COPY . /usr/src/buddies

EXPOSE 3000
CMD [ "npm", "start" ]