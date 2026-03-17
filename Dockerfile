# Stage 1: Build VitePress static site
FROM oven/bun:1 AS builder
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
WORKDIR /build
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN git config --global user.email "build@lurus.cn" && git config --global user.name "build" \
    && git init && git add -A && git commit -m "build"
RUN bun run build

# Stage 2: Production server
FROM oven/bun:1-alpine
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --production --frozen-lockfile

COPY server/ ./server/
COPY --from=builder /build/docs/.vitepress/dist ./static/

RUN mkdir -p /data && chown -R 65534:65534 /data /app

USER 65534

EXPOSE 3000

CMD ["bun", "run", "server/index.ts"]
