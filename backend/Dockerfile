FROM node:20-alpine

WORKDIR /app

RUN corepack enable pnpm
COPY package*.json ./
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]
