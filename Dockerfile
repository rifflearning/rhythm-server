# Args for FROM directives
ARG NODE_VER=10

#
# ---- Base Node image ----
FROM node:${NODE_VER} AS base
# The node:8 npm (v 5.6) has some issues, update it to latest
RUN npm install -g npm
# create and set working directory owned by non-root user; set that user
WORKDIR /app
RUN chown node:node /app
USER node
# copy the app project file
COPY --chown=node:node package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Test ----
# run linters, setup and tests
#  see https://codefresh.io/docker-tutorial/node_docker_multistage/
#  when ready to add this stage (if test stage fails, image build fails)
#FROM dependencies AS test
#COPY . .
#RUN  npm run lint && npm run setup && npm run test

#
# ---- Release ----
FROM base AS release
LABEL Description="This image runs the riff-server which collects utterance info made by participants in meetings"
# This is the production image, set NODE_ENV to reflect that
ENV NODE_ENV=production
# copy production node_modules
COPY --from=dependencies --chown=node:node /app/prod_node_modules ./node_modules
# copy app sources
COPY --chown=node:node ./config ./config/
COPY --chown=node:node ./src ./src/
# allow the port used to be specified, default to 3000
ARG PORT=3000
ENV PORT=$PORT
# expose port
EXPOSE $PORT
# allow all referenced environment variables to be overridden
ARG AUTH_ON
ARG AUTH_TOKEN_EXPIRESIN
ARG AUTH_TOKEN_SECRET
ARG CRYPTO_KEY
ARG DEFAULT_USER_EMAIL
ARG DEFAULT_USER_PASSWORD
ARG MONGODB_URI
ARG MONGO_CERT
ARG REPORT_EMAIL_FROM
ARG REPORT_EMAIL_HOST
ARG REPORT_EMAIL_LOGIN
ARG REPORT_EMAIL_PASSWORD
ARG REPORT_EMAIL_SUBJECT
ARG REPORT_EMAIL_TEXT
ARG SEND_REPORT
ARG END_MEETING_AFTER_MINUTES
# Set the environment variables w/ values passed in
# (Why are we doing this when if the environment var doesn't exist the .env file is read?
#  right now using the .env file seems better than the environment, later the config files. -mjl)
ENV AUTH_ON=$AUTH_ON \
    AUTH_TOKEN_EXPIRESIN=$AUTH_TOKEN_EXPIRESIN \
    AUTH_TOKEN_SECRET=$AUTH_TOKEN_SECRET \
    CRYPTO_KEY=$CRYPTO_KEY \
    DEFAULT_USER_EMAIL=$DEFAULT_USER_EMAIL \
    DEFAULT_USER_PASSWORD=$DEFAULT_USER_PASSWORD \
    MONGODB_URI=$MONGODB_URI \
    MONGO_CERT=$MONGO_CERT \
    REPORT_EMAIL_FROM=$REPORT_EMAIL_FROM \
    REPORT_EMAIL_HOST=$REPORT_EMAIL_HOST \
    REPORT_EMAIL_LOGIN=$REPORT_EMAIL_LOGIN \
    REPORT_EMAIL_PASSWORD=$REPORT_EMAIL_PASSWORD \
    REPORT_EMAIL_SUBJECT=$REPORT_EMAIL_SUBJECT \
    REPORT_EMAIL_TEXT=$REPORT_EMAIL_TEXT \
    SEND_REPORT=$SEND_REPORT \
    END_MEETING_AFTER_MINUTES=$END_MEETING_AFTER_MINUTES
# define command to start the riff-server
CMD ["npm", "start"]
