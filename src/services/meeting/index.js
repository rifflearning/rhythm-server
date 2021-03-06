'use strict'

const service = require('feathers-mongoose')
const meeting = require('./meeting-model')
const hooks = require('./hooks')

module.exports = function () {
  const app = this          // eslint-disable-line consistent-this

  const options = {
    Model: meeting,
    lean: true
  }

  app.use('/meetings', service(options))

  const meetingService = app.service('/meetings')
  meetingService.hooks(hooks)
}
