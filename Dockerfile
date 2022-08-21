FROM node:alpine

WORKDIR /usr/nodeApp

COPY ./package.json ./

RUN npm i 

COPY ./ ./

CMD ["npm", "start"]