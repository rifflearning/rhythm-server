'use strict'

// const repeatHook = require('./repeatHook').hook
const auth = require('@feathersjs/authentication')
const sanitize = require('./sanitize')

exports.before = {
  all: [ auth.hooks.authenticate('jwt'), sanitize() ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
