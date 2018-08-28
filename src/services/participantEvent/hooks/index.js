'use strict'

const auth = require('@feathersjs/authentication')
const { fastJoin } = require('feathers-hooks-common')

exports.before = {
  all: [ auth.hooks.authenticate('jwt') ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}

const pEventResolvers = {
  joins: {
    meeting: () => async (pEvent, context) => {
      pEvent.meeting = (await context.app.service('meetings').find({
        query: { _id: pEvent.meeting } }))[0]
    }
  }
}

exports.after = {
  all: [ fastJoin(pEventResolvers) ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
