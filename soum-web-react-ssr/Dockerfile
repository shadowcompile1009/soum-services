FROM node:20-alpine3.20 as build

RUN mkdir -p /app

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build:production

FROM node:20-alpine3.20

RUN mkdir -p /app/build

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/build ./build

ENV NODE_ENV=production

CMD ["node","./build/server.js"]