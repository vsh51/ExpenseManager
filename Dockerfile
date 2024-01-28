FROM node

WORKDIR /app

COPY package.json /app

RUN npm install
RUN npm install -g nodemon

COPY . /app

EXPOSE ${NA_PORT}

CMD ["nodemon", "app.js"]