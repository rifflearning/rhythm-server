FROM node:8
LABEL Description="This image runs the riff-server which collects utterance info made by participants in meetings"

ARG AUTH_ON
ARG AUTH_TOKEN_EXPIRESIN
ARG AUTH_TOKEN_SECRET
ARG CRYPTO_KEY
ARG DEFAULT_USER_EMAIL
ARG DEFAULT_USER_PASSWORD
ARG MONGODB_URI
ARG MONGO_CERT
ARG NODE_ENV
ARG PORT
ARG REPORT_EMAIL_FROM
ARG REPORT_EMAIL_HOST
ARG REPORT_EMAIL_LOGIN
ARG REPORT_EMAIL_PASSWORD
ARG REPORT_EMAIL_SUBJECT
ARG REPORT_EMAIL_TEXT
ARG SEND_REPORT
ARG END_MEETING_AFTER_MINUTES

ENV AUTH_ON=$AUTH_ON
ENV AUTH_TOKEN_EXPIRESIN=$AUTH_TOKEN_EXPIRESIN
ENV AUTH_TOKEN_SECRET=$AUTH_TOKEN_SECRET
ENV CRYPTO_KEY=$CRYPTO_KEY
ENV DEFAULT_USER_EMAIL=$DEFAULT_USER_EMAIL
ENV DEFAULT_USER_PASSWORD=$DEFAULT_USER_PASSWORD
ENV MONGODB_URI=$MONGODB_URI
ENV MONGO_CERT=$MONGO_CERT
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV REPORT_EMAIL_FROM=$REPORT_EMAIL_FROM
ENV REPORT_EMAIL_HOST=$REPORT_EMAIL_HOST
ENV REPORT_EMAIL_LOGIN=$REPORT_EMAIL_LOGIN
ENV REPORT_EMAIL_PASSWORD=$REPORT_EMAIL_PASSWORD
ENV REPORT_EMAIL_SUBJECT=$REPORT_EMAIL_SUBJECT
ENV REPORT_EMAIL_TEXT=$REPORT_EMAIL_TEXT
ENV SEND_REPORT=$SEND_REPORT
ENV END_MEETING_AFTER_MINUTES=$END_MEETING_AFTER_MINUTES

# Modified bashrc which defines some aliases and an interactive prompt (for both root & node users)
COPY docker/bashrc /root/.bashrc

# set the root password to password (I don't care that it's simple it's only for development
# this shouldn't exist in a production container
RUN echo "root:password" | chpasswd

# The node:8 npm v 5.6 has some issues, update it to 6.0
RUN npm install -g npm

# copy and install dependencies separately so they cache
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# node images have a node user w/ UID 1000 (works well for me for now, but more thought may be needed later) -mjl
USER node
WORKDIR /app
COPY docker/bashrc /home/node/.bashrc

EXPOSE 3000

# riff-server repository working directory must be bound at /app and all dependent packages installed
CMD ["npm", "start"]
# ENTRYPOINT ["/bin/bash"]
