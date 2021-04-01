FROM node:13.6.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
EXPOSE 3444

CMD ["npm", "start"]