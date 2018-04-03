import mongoose from 'mongoose';

const SessionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  lecturer: {
    type: String,
    required: true
  }
});

const Session = mongoose.model('session', SessionSchema);

module.exports = Session;

module.exports.createNew = async (new_session) => {
  let new_instance = new Session(new_session);
  await new_instance.save();
}
