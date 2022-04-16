FROM node:alpine

RUN mkdir /config
RUN mkdir /app

COPY . /app

WORKDIR /app

RUN npm install

CMD ["npm","start"]