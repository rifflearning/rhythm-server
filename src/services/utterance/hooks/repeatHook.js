const _ = require('underscore')
const winston = require('winston')

function dateDiff (d1, d2) {
  return Math.abs(new Date(d1).getTime() - new Date(d2).getTime())
}

exports.hook = function (hook) {
  winston.log('info', 'utterance data:', hook.data)
  hook.app.service('utterances')
    .find({
      query: {
        $and: [{ meeting: hook.data.meeting },
               { participant: hook.data.participant }]
      }
    })
    .then((foundUtterances) => {
      var timeMatchThreshold = 1.5 * 1000 // threshold for times being "matched", in ms
      // there are some talk events from this participant
      // filter them, find if any are very close:
      // TODO this also seems expensive if there are many utterances in a meeting
      winston.log('info', 'utterances found: ' + foundUtterances.length)
      var matches = _.filter(foundUtterances,
                             function (utterance) {
                               var startDiff = dateDiff(utterance.startTime,
                                                        hook.data.startTime)
                               var endDiff = dateDiff(utterance.endTime,
                                                      hook.data.endTime)
                               return (startDiff < timeMatchThreshold ||
                                       endDiff < timeMatchThreshold)
                             })
      if (matches.length === 0) {
        winston.log('info', 'Inserting new talking history data, not a repeat...')
        return hook
      } else {
        // TODO what if i speak for one second, pause for half a second,
        // then start speaking again
        // is that entire next utterance dropped?
        winston.log('info', 'Tried to insert repeat talking history data! Nuh-Uh', matches, hook.data)
        hook.data = {}
        return hook
      }
    })
}
