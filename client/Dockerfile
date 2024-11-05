FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 4173

CMD ["sh", "-c", "yarn build && yarn preview"]
