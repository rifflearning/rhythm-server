'use strict'

// meeting-model.js - model for meetings.
//
// currentParticipants are the collection of participants *currently* in the meeting.
// attendingParticipants are the collection of all participants in the meeting.

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const meetingSchema = new Schema({
  _id: { type: String },
  currentParticipants: [{ type: String, ref: 'Participant' }],
  attendingParticipants: [{ type: String, ref: 'Participant' }],
  room: String,
  startTime: { type: Date, 'default': Date.now },
  endTime: Date,
  active: Boolean,
  meetingUrl: String,
  meta: Object
})

const meetingModel = mongoose.model('meeting', meetingSchema)

module.exports = meetingModel
