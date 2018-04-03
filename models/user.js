import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import {_generate_jti} from '../util';

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
  email: {
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

module.exports.createNew = async (new_user) => {
  let new_instance = new User(new_user);
  if (['admin', 'staff'].includes(new_instance.position)) {
    new_instance._jti = _generate_jti();
    let salt = await bcrypt.genSalt(10)
  	let hash = await bcrypt.hash(new_user.password, salt)
  	new_instance.password = hash;
  	new_instance.email = new_user.email.toLowerCase();
  }
  await new_instance.save();
  return new_instance._id;
}
