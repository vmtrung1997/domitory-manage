FROM node:10

WORKDIR /home/ktx-frontend

COPY package.json /home/ktx-frontend

COPY src /home/ktx-frontend

COPY public /home/ktx-frontend

RUN yarn install

ENV PATH /home/ktx-frontend/node_modules/.bin:$PATH

CMD ["yarn", "start"]

EXPOSE 9000

