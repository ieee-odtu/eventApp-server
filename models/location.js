import mongoose from 'mongoose';

const LOCS = ['gate', 'desk'];

const LocationSchema = mongoose.Schema({
  location: {
    type: String,
    enum: LOCS,
    required: true
  },
  position: {
    type: String,
    required: true
  }
});

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
