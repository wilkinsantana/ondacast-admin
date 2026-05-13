# OndaCast Admin — SvelteKit adapter-node multi-stage build
# Stage 1: build the Node.js server
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Stage 2: production runtime with only production deps
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --production --no-audit --no-fund
COPY --from=build /app/build /app/build
COPY --from=build /app/.svelte-kit /app/.svelte-kit

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "build/index.js"]
