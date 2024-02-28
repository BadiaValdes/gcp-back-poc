FROM node:slim AS builder

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN yarn

CMD ls

COPY . .

RUN yarn tsc

FROM node:slim AS PROD

WORKDIR /app

COPY --from=builder /app/dist /app
COPY --from=builder /app/.env /app
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3002

CMD node index.js