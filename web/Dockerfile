FROM node:25.2

# Install dependencies.
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
