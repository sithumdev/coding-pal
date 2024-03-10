FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/client ./client
COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY .env ./

# Expose the port the app runs on
EXPOSE 8080

# Start the app
CMD [ "node", "dist/main" ]