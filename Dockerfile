FROM node:14-alpine
MAINTAINER node-14-alpine
ENV CONFIGOR_ENV=development
ADD . /build
WORKDIR /build
RUN echo "https://mirrors.aliyun.com/alpine/latest-stable/main" > /etc/apk/repositories && \
    echo "https://mirrors.aliyun.com/alpine/latest-stable/community" >> /etc/apk/repositories && \
    rm -rf node_modules && chmod 777 -R /build && \
    npm install --registry=http://registry.npm.taobao.org
EXPOSE 9393 9394
CMD node /build/main.js 0