FROM node:14.15 as builder
LABEL MAINTAINER="PAranoids <xochilpili@gmail.com>"
# define env with app dir
ENV APP_PATH=/usr/src/torrent-api
# copy content of monorepo to app dir
ADD . ${APP_PATH}
# install lerna globaly
RUN npm install lerna -g 
# execute npm install && lerna bootstrap
RUN cd ${APP_PATH} && npm install
WORKDIR ${APP_PATH}
# build all dependencies
RUN lerna run types:build
# set WORKDIR as package directory
WORKDIR ${APP_PATH}/packages/torrent
# build application by defined command in package.json
RUN npm run torrent:build
#
# Production stage.
#
FROM node:14.15-alpine

WORKDIR /torrent-api
ENV NODE_ENV=production
# copy entire application dir
COPY --from=builder /usr/src/torrent-api .
# execute built package
CMD [ "node", "/torrent-api/packages/torrente/dist/index.js" ]
