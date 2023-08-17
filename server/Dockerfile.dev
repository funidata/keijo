FROM node:18.17

USER node

# Install dependencies.
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Start via Nest in development mode.
CMD npx nest start --watch --preserveWatchOutput