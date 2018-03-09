import mongoose from 'mongoose';

import constants from '../config/constants';

const LocationSchema = mongoose.Schema({
  location: {
    type: String,
    enum: constants.models.Locations,
    required: true
  },
  position: {
    type: String,
    required: true
  }
});

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
