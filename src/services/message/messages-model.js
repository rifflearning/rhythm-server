'use strict'

// utterance-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  participant: { type: String, ref: 'Participant' },
  meeting: { type: String, ref: 'Meeting' },
  time: Date,
  msg: String
});

const messageModel = mongoose.model('message', messageSchema)

module.exports = messageModel
