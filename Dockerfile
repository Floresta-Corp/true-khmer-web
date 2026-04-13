FROM oven/bun:1-alpine AS development-dependencies-env

COPY . /app
WORKDIR /app

RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS production-dependencies-env

COPY ./package.json bun.lock /app/
WORKDIR /app

RUN bun install --frozen-lockfile --production

FROM oven/bun:1-alpine AS build-env

ARG VITE_R2_PUBLIC_BASE_URL
ARG VITE_PLUMPI_WEB

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

RUN bun run build

FROM node:22-alpine

COPY ./package.json /app/

ENV PORT="3000"
ENV NODE_ENV="production"
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ARG PLUMPI_ENDPOINT
ENV PLUMPI_ENDPOINT=$PLUMPI_ENDPOINT
ENV SESSION_SECRET=$SESSION_SECRET

COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

CMD ["npm", "run", "start"]