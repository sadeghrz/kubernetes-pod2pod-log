# Build stage

FROM node:10-alpine3.9 as builder

WORKDIR /usr/src/app

RUN apk update && apk add libpcap-dev && apk add python && apk add build-base

COPY package*.json ./

RUN npm install

# Deploy stage

FROM node:10-alpine3.9

RUN apk update && apk add libpcap-dev

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

#COPY src/cap.js .

# Just for test and development
# COPY httpServer.js .
# RUN apk add curl
# EXPOSE 80

CMD [ "node", "src/cap.js" ]
