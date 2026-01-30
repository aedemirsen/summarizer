FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . ./

ENV NODE_ENV=production
ENV PORT=9090

EXPOSE 9090

CMD ["node", "server.js"]
