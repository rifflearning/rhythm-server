'use strict'

const service = require('feathers-mongoose')
const messages = require('./messages-model')
const hooks = require('./hooks')

module.exports = function () {
  const app = this          // eslint-disable-line consistent-this

  const options = {
    Model: messages
  }

  // Initialize our service with any options it requires
  app.use('/messages', service(options))

  // Get our service so that we can bind hooks
  const messagesService = app.service('/messages')

  // Set up our hooks
  messagesService.hooks(hooks)
}
