FROM mhart/alpine-node:latest
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 8080
CMD ["yarn", "start"]
