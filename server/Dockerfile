FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]
