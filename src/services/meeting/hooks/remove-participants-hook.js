// remove-participant-hook.js
// if there is a 'remove_participants' query parameter in a `patch`
// request with an associated list of participant IDs, it removes those
// participants from the meeting.

'use strict'
const _ = require('underscore')
const winston = require('winston')

module.exports = function (hook) {
  winston.log("info", ">>>> remove participants hook", hook.id, "|", hook.remove_participants, "|", hook.data.id, "|", hook.data.remove_participants);
  if (hook.data.remove_participants) {
    winston.log("info", ">>>> remove participants hook", hook.id, hook.data.id, hook.data.remove_participants);
    return hook.app.service('meetings')
      .get(hook.id)
      .then((meeting) => {
        winston.log("info", "removing participants", hook.data.remove_participants, "from meeting w ", meeting.participants);
        var oldParticipants = meeting.participants
        hook.data.participants = _.difference(oldParticipants,
                                              hook.data.remove_participants)
        delete hook.data.remove_participants
        return hook
      })
      .catch((err) => {
        winston.log('error', 'couldnt remove given participants', err)
        return hook
      })
  } else {
    return hook
  }
}
