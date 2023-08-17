FROM node:18.17 AS build

# Install dependencies.
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build


FROM node:18.17-alpine

USER node

WORKDIR /app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

CMD node dist/main.js
