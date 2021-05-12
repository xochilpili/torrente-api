FROM node:14.15 as builder
LABEL MAINTAINER="PAranoids <xochilpili@gmail.com>"
# define env with app dir
ENV APP_PATH=/usr/src/subtitler-api
# copy content of monorepo to app dir
ADD . ${APP_PATH}
# install lerna globaly
RUN npm install lerna -g 
# execute npm install && lerna bootstrap
RUN cd ${APP_PATH} && npm install && lerna bootstrap
WORKDIR ${APP_PATH}
# build all dependencies
RUN lerna run types:build
# set WORKDIR as package directory
WORKDIR ${APP_PATH}/packages/subtitler
# build application by defined command in package.json
RUN npm run subtitler:build
#
# Production stage.
#
FROM node:14.15-alpine

WORKDIR /subtitler-api
ENV NODE_ENV=production
# copy entire application dir
COPY --from=builder /usr/src/subtitler-api .
# execute built package
CMD [ "node", "/subtitler-api/packages/subtitler/dist/index.js" ]
