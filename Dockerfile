FROM node:6

MAINTAINER Democracia en Red <it@democracyos.org>

RUN npm config set python python2.7

WORKDIR /usr/src

COPY ["package.json", "."]

ENV NODE_ENV=production \
    NODE_PATH=/usr/src

RUN npm install --quiet

RUN mkdir ext
COPY ["ext/package.json", "ext"]

RUN mkdir bin
COPY ["bin/dos-ext-install", "bin"]

RUN bin/dos-ext-install --quiet

COPY [".", "/usr/src/"]

RUN npm run build -- --minify

EXPOSE 3000

CMD ["node", "."]
