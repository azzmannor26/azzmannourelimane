FROM node:21 AS base

FROM base AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn prisma generate
RUN yarn run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
RUN npm install -g prisma
ENV NODE_ENV production
EXPOSE 3010
CMD [ "node", "dist/src/main" ]
