# Production image.
# Has to be run with the parent folder as context for the builder to access frontend files.
FROM node:18.17 AS build

# Build backend.
WORKDIR /usr/src/app
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server .
RUN npm run build

# Build frontend.
ENV API_URL=/graphql
WORKDIR /usr/src/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web .
RUN npm run build


# Final build stage to pick only actually needed files into the image.
FROM node:18.17-alpine

USER node

WORKDIR /app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/web/out ./public

ENTRYPOINT ["node", "dist/main.js"]
