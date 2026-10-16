FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node admin.js server.js site-content.js store.js ./
COPY --chown=node:node public ./public
RUN mkdir -p /app/.data && chown node:node /app/.data

USER node
EXPOSE 3000
CMD ["npm", "start"]
