import express from 'express';
const router = express.Router();

import User from '../models/user';
import Session from '../models/session';

import {jwtValidate} from '../middleware/jwt';
import {_EUNEXP, _E_CAST, _CREATED, _FAIL, _SUCC} from '../util';

router.get('/', jwtValidate('utype', ['admin']), (req, res, next) => {
  User.find({}, {_id: 0, __v: 0, password: 0, _jti: 0})
    .then(users => {
      if (users.length == 0) {
        return _FAIL(res, 'U_NF');
      } else {
        return _SUCC(res, {
          users: users
        });
      }
  })
  .catch(err => {
    return _EUNEXP(res, err);
  });
});

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

router.get('/:uid', jwtValidate('utype', ['admin']), (req, res, next) => {
  User.findById(req.params.uid, {_id: 0, __v: 0, password: 0, _jti: 0})
    .then(found => {
      if (found) {
        return _SUCC(res, {
          user: found
        });
      } else {
        return _FAIL(res, 'U_NF');
      }
    })
    .catch(err => {
      return _EUNEXP(res, err, {
        id: req.params.uid,
        found: found
      });
    });
});

router.get('/:uid/sessions', jwtValidate('utype', ['admin', 'staff', 'participant']), (req, res, next) => {
  User.findById(req.params.uid)
    .then(found => {
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
    })
    .catch(err => {
      return _EUNEXP(res, err, {
        id: req.params.uid
      });
    });
});

router.post('/:uid/sessions', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findById(req.params.uid)
    .then(found_user => {
      if (found_user) {
        Session.findById(req.body.session)
          .then(found_session => {
            if (found_session) {
              found_user.sessions.push(found_session._id);
              found_user.save();
              return _SUCC(res);
            } else {
              return _FAIL(res, 'S_NF');
            }
          })
          .catch(err => {
            return _EUNEXP(res, err, {
              session: req.body.session
            });
          });
      } else {
        return _FAIL(res, 'U_NF');
      }
    })
    .catch(err => {
      return _EUNEXP(res, err, {
        id: req.params.uid
      });
    });
});

router.delete('/:uid/sessions/:sid', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findById(req.params.uid)
    .then(found_user => {
      if (err) _EUNEXP(res, err, {
        uid: req.params.uid
      });
      if (found_user) {
        Session.findById(req.params.sid)
          .then(found_session => {
            if (found_session) {
              found_user.sessions.splice(found_user.sessions.indexOf(found_session._id), 1);
              found_user.save();
              return _SUCC(res);
            } else {
              return _FAIL(res, 'S_NF');
            }
          })
          .catch(err => {
            return _EUNEXP(res, err, {
              sid: req.params.sid
            });
          });
      } else {
        return _FAIL(res, 'U_NF');
      }
    })
    .catch(err => {
      return _EUNEXP(res, err, {
        id: req.params.uid
      });
    });
});

module.exports = router;
