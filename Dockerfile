FROM node:23-alpine3.20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

COPY .env .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
