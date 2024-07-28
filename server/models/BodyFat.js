// models/BodyFat.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bodyFatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  waist: {
    type: Number,
    required: true,
  },
  hip: {
    type: Number,
    required: true,
  },
  neck: {
    type: Number,
    required: true,
  },
  bodyFatPercentage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BodyFat = mongoose.model('BodyFat', bodyFatSchema);

module.exports = BodyFat;
