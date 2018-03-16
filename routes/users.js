import express from 'express';
const router = express.Router();

import User from '../models/user';
import Session from '../models/session';

import {jwtValidate} from '../middleware/jwt';
import {_EUNEXP, _E_CAST, _CREATED, _FAIL} from '../util';

router.get('/', jwtValidate('utype', ['admin']), (req, res, next) => {
  User.find({}, {_id: 0, __v: 0, password: 0, _jti: 0}, (err, users) => {
    //if (err) return _EUNEXP(res, err, {
    //  users: users
    //});
    console.log('In /u/')
    if (err) return _EUNEXP(res, err);
    if (users.length == 0) {
      return _FAIL(res, 'U_NF');
    } else {
      console.log('Want to return _SUCC')
      //return _SUCC(res, {
      //  users: users
      //});
      return res.status(200).json({
        users: users
      })
    }
  });
});

router.post('/', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findOne({email: req.body.user.email}, (err, found) => {
    if (err) return _EUNEXP(res, err, {
      user: req.body.user
    });
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
  });
});

router.get('/:uid', jwtValidate('utype', ['admin']), (req, res, next) => {
  console.log("uid:", typeof req.params.uid);
  User.findOne({name: req.params.uid}, (err, found) => {
    if (err) return _EUNEXP(res, err, {
      id: req.params.uid,
      found: found
    });
    if (found) {
      return _SUCC(res, {
        user: found
      });
    } else {
      return _FAIL(res, 'U_NF');
    }
  });
});

router.get('/:uid/sessions', jwtValidate('utype', ['admin', 'staff', 'participant']), (req, res, next) => {
  User.findById(req.params.uid)
    .then((found) => {
      if (found) {
        console.log('/u/ found')
        console.log('found:', found)
        return _SUCC(res, {
          sessions: found.sessions
        });
      } else {
        console.log('/u/ not found')
        //return _FAIL(res, 'U_NF');
        return res.status(404).json({
          success: false,
          code: 'U_NF'
        });
      }
    })
    .catch((err) => {
      console.log('/u/ err');
      return _EUNEXP(res, err, {
        id: req.params.uid
      });
    });
});

router.post('/:uid/sessions', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findById(req.params.uid, (err, found_user) => {
    if (err) _EUNEXP(res, err, {
      id: req.params.uid
    });
    if (found_user) {
      Session.findById(req.body.session, (err, found_session) => {
        if (err) _EUNEXP(res, err, {
          session: req.body.session
        });
        if (found_session) {
          found_user.sessions.push(found_session._id);
          found_user.save();
          return _SUCC(res);
        } else {
          return _FAIL(res, 'S_NF');
        }
      });
    } else {
      return _FAIL(res, 'U_NF');
    }
  });
});

router.delete('/:uid/sessions/:sid', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findById(req.params.uid, (err, found_user) => {
    if (err) _EUNEXP(res, err, {
      uid: req.params.uid
    });
    if (found_user) {
      Session.findById(req.params.sid, (err, found_session) => {
        if (err) _EUNEXP(res, err, {
          sid: req.params.sid
        });
        if (found_session) {
          found_user.sessions.splice(found_user.sessions.indexOf(found_session._id), 1);
          found_user.save();
          return _SUCC(res);
        } else {
          return _FAIL(res, 'S_NF');
        }
      });
    } else {
      return _FAIL(res, 'U_NF');
    }
  });
});

module.exports = router;
