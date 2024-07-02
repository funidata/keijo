# Production image.
# Has to be run with the parent folder as context for the builder to access frontend files.
FROM node:20.12 AS build

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
ARG VITE_MOCK_EMPLOYEE_NUMBER=123
RUN --mount=type=secret,id=mui_x_license \
  VITE_MUI_X_LICENSE=$(cat /run/secrets/mui_x_license) npm run build


# Final build stage to pick only actually needed files into the image.
FROM node:20.12-alpine

USER node

WORKDIR /app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/web/dist ./public

# Run database migrations before booting server.
CMD npx typeorm migration:run -d dist/database/migration-config.js && node dist/main.js
