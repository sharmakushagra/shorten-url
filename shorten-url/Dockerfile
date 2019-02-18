FROM node:carbon

# Create app directory
RUN mkdir -p /usr/src/url-shorten-service
WORKDIR /usr/src/url-shorten-service

# Install app dependencies
COPY package.json /usr/src/url-shorten-service/
RUN npm install

# Bundle app source
COPY . /usr/src/url-shorten-service

#EXPOSE 7272
#CMD [ "npm", "start" ]

EXPOSE 7272
RUN npm start