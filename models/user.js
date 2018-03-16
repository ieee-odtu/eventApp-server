import mongoose from 'mongoose';

const UTYPES = ['admin', 'staff', 'participant'];

const ContactSchema = mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: UTYPES,
    required: true
  },
  contact: {
    type: ContactSchema,
    required: function () {
      return this.position == 'participant';
    }
  },
  sessions: {
    type: [String], // Session id's
    required: function () {
      return this.position == 'participant';
    }
  },
  location: {
    type: String, // Loc id
    required: function () {
      return this.position == 'staff';
    }
  },
  password: {
    type: String,
    required: function () {
      return ['admin', 'staff'].includes(this.position);
    }
  },
  _jti: {
    type: String,
    required: function () {
      return ['admin', 'staff'].includes(this.position);
    }
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
