FROM node:20

WORKDIR /app

COPY ./dist/ssr .
RUN npm i
RUN npm install pm2 -g

RUN export NODE_OPTIONS=--openssl-legacy-provider
ENTRYPOINT ["pm2-runtime", "index.js"]
