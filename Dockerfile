FROM node:16.15.1-bullseye AS build

WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build
RUN npm set-scripts prepare "" && npm ci --only=production && npm cache clean --force
USER node

FROM node:16.15.1-bullseye As production

WORKDIR /home/node/app
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

ENV NODE_ENV production
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
