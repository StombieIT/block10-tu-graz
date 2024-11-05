FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install

ENV APP_PORT=4173

EXPOSE $APP_PORT

CMD ["sh", "-c", "yarn build && yarn preview"]
