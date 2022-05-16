FROM node:16.15.0-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

FROM node:16.15.0-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:16.15.0-slim AS runner

WORKDIR /chrome

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget ca-certificates chromium gnupg fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends

# Create pptuser as non-priviledge user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && mkdir -p /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist/ ./dist

RUN npm install --production

USER pptruser

CMD [ "npm", "start" ]
