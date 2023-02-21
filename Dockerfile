FROM node:16

WORKDIR /usr/src/app

COPY ["package.json","pnpm-lock.yaml", ".eslintrc.js", "tsconfig.json", "./"]

RUN npm install

COPY /src ./src

RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "start" ]