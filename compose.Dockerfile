FROM node:18.16-bullseye-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:18.16-bullseye-slim AS builder

RUN apt-get update \
  && apt-get install -y wget postgresql-client ca-certificates bash \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENTRYPOINT [ "/app/scripts/compose.sh" ]
