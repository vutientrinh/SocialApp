FROM node:18-alpine

WORKDIR /tmp/social-network-frontend

# copy file to the container
COPY package.json yarn.lock ./

# copy public files to the container
COPY public ./public

# copy source code to the container
COPY src ./src

COPY . .

# RUN npm install
RUN yarn install

# build the app
RUN yarn build

# port
EXPOSE 3000

# start app
CMD ["yarn", "start"]
