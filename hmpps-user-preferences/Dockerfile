## use slim not alpine otherwise PACT binarys wont load due to missing libs
FROM node:24.12-slim as base

## common
RUN apt-get update
RUN apt-get install -y sqlite3 libsqlite3-dev
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm ci
RUN npm run build
RUN npm run seed
EXPOSE 3000



CMD [ "node",  "dist/index.js"]
