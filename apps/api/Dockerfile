FROM node:22-bookworm-slim AS build

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ENV NX_DAEMON=false
RUN npx nx build auth-pod --skip-nx-cache

FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
