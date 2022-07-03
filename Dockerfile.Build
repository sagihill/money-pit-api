FROM node:16.15.0 as base

WORKDIR /usr/app

# Add package file
COPY package.json ./
COPY package-lock.json ./
COPY scripts/dev.sh ./scripts/dev.sh

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Install deps
RUN npm install

# Copy source
COPY . ./
COPY tsconfig.json ./tsconfig.json
COPY openapi.json ./openapi.json

# Build dist
RUN npm run build

# Start production image build
# FROM gcr.io/distroless/nodejs:16

# Copy node modules and build directory
# COPY --from=base /usr/app/node_modules ./node_modules
# COPY --from=base /usr/app/build ./
# COPY --from=base /usr/app/package*.json ./

# Copy static files
COPY src/public build/src/public

# Expose port 3000
EXPOSE 3000

CMD ["build/src/server.js"]