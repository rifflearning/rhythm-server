const winston = require('winston')

exports.hook = function (hook) {
  if (hook.data.meeting !== undefined || hook.data.room === undefined) {
    winston.info('skipping room hook')
    return hook
  }
  winston.debug('hook before roomHook (1): ', hook.data)
  var query = { query: { room: hook.data.room, active: true } }
  return hook.app.service('meetings').find(query).then((mtgs) => {
    if (mtgs.length === 0) {
      return hook
    }
    hook.data.meeting = mtgs[0]._id
    winston.debug('hook after roomHook (1): ', hook.data)
    return hook
  })
}
