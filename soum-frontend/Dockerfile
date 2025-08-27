
# pull official base image
FROM node:16.10-alpine as builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
RUN npm install
ARG environment
# Bundle app source
COPY . .
RUN npm run build-$environment

FROM nginx:1.19.0
ARG projectname
COPY --from=builder  app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder  app/dist/$projectname/ /usr/share/nginx/html