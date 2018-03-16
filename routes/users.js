import express from 'express';
const router = express.Router();

import User from '../models/user';
import Session from '../models/session';

import {jwtValidate} from '../middleware/jwt';
import {_EUNEXP, _E_CAST, _CREATED, _FAIL, _SUCC, asyncWrap} from '../util';

router.get('/', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {
  let users = await User.find({}, {_id: 0, __v: 0, password: 0, _jti: 0})
  if (users.length == 0) {
    return _FAIL(res, 'U_NF');
  } else {
    return _SUCC(res, {
      users: users
    });
  }
}));

router.post('/', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findOne({email: req.body.user.email})
    .then(found => {
      if (found) {
        return _FAIL(res, 'REG_EMAIL');
      } else {
        if (req.user.position == 'staff' && req.body.utype != 'participant') {
          return _FAIL(res, 'E_UNAUTH');
        }
        req.body.user.position = req.body.utype;
        User.createNew(req.body.user, (err, ret) => {
          if (err) return _ERR(res, err, {
            user: req.body.user,
            ret: ret
          });
          return _CREATED(res, 'User', {
            ret: ret
          });
        });
      }
    })
    .catch(err => {
      return _EUNEXP(res, err, {
        user: req.body.user
      });
    });
});

router.get('/:uid', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {
  let found = await User.findById(req.params.uid, {_id: 0, __v: 0, password: 0, _jti: 0})
  if (found) {
    return _SUCC(res, {
      user: found
    });
  } else {
    return _FAIL(res, 'U_NF');
  }
}));

router.get('/:uid/sessions', jwtValidate('utype', ['admin', 'staff', 'participant']), asyncWrap(async (req, res, next) => {
  let found = await User.findById(req.params.uid)
  if (found) {
    if (found.sessions.length == 0) {
      return _FAIL(res, 'S_NF');
    } else {
      return _SUCC(res, {
        sessions: found.sessions
      });
    }
  } else {
    return _FAIL(res, 'U_NF');
  }
}));

router.post('/:uid/sessions', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {
  let found_user = await User.findById(req.params.uid)
  if (found_user) {
    let found_session = await Session.findById(req.body.session)
    if (found_session) {
      found_user.sessions.push(found_session._id);
      found_user.save();
      return _SUCC(res);
    } else {
      return _FAIL(res, 'S_NF');
    }
  } else {
    return _FAIL(res, 'U_NF');
  }
}));

router.delete('/:uid/sessions/:sid', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {
  let found_user = await User.findById(req.params.uid)
  if (found_user) {
    let found_sesion = await Session.findById(req.params.sid)
    if (found_session) {
      found_user.sessions.splice(found_user.sessions.indexOf(found_session._id), 1);
      found_user.save();
      return _SUCC(res);
    } else {
      return _FAIL(res, 'S_NF');
    }
  } else {
    return _FAIL(res, 'U_NF');
  }
}));

module.exports = router;
