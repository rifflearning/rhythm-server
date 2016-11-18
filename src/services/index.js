'use strict'

const utteranceDistribution = require('./utteranceDistribution')

const turn = require('./turn')
const participantEvent = require('./participantEvent')
const meetingEvent = require('./meetingEvent')
const utterance = require('./utterance')
const participant = require('./participant')
const authentication = require('./authentication')
const user = require('./user')
const meeting = require('./meeting')
const mongoose = require('mongoose')

module.exports = function () {
  const app = this

  let options = {
    server: {sslCA: process.env.MONGO_CERT,
             auto_reconnect: true,
             poolSize: 5}
  }

  mongoose.connect(process.env.MONGODB_URI, options)
  mongoose.Promise = global.Promise

  app.configure(authentication)
  app.configure(user)
  app.configure(meeting)
  app.configure(participant)
  app.configure(utterance)
  app.configure(meetingEvent)
  app.configure(participantEvent)
  app.configure(turn)
  app.configure(utteranceDistribution)
}
