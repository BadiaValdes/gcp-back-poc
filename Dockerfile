FROM node:slim

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "src/index.js" ]

EXPOSE 8080