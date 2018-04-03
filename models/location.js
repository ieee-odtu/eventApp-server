import mongoose from 'mongoose';

const LOCS = ['gate', 'desk'];

const LocationSchema = mongoose.Schema({
  location: {
    type: String,
    enum: LOCS,
    required: true
  },
  position: { // Detailed loc info
    type: String,
    required: true
  }
});

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;

module.exports.createNew = async (new_loc) => {
  let new_instance = new Session(new_loc);
  await new_instance.save();
}
