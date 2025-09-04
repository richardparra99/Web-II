FROM node:22

WORKDIR /app

COPY packetge*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
