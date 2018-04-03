// add-participant-hook.js
// if there is an 'add_currentParticipant' query parameter in a `patch`
// request with an associated participant ID, it adds that
// participant to the meeting

'use strict'
const _ = require('underscore')
const winston = require('winston')

module.exports = function (hook) {
  if (hook.data.add_currentParticipant) {
    winston.log('info', 'adding current participant:', hook.data.add_currentParticipant)
    return hook.app.service('meetings')
      .get(hook.id)
      .then((meeting) => {
        var oldParticipants = meeting.currentParticipants
        if (_.contains(oldParticipants, hook.data.add_currentParticipant)) {
          return hook
        } else {
          hook.data.currentParticipants = _.union(oldParticipants, [ hook.data.add_currentParticipant ])
          delete hook.data.add_currentParticipant
          return hook
        }
      })
      .catch((err) => {
        winston.log('error', 'couldnt add given current participant', err)
        return hook
      })
  } else {
    winston.log('info', 'not adding participant:')
    return hook
  }
}
