import express from 'express';
const router = express.Router();

import User from '../models/user';

import {jwtValidate} from '../middleware/jwt;'
import {_EUNEXP, _E_CAST, _CREATED} from '../util';

router.get('/', jwtValidate('utype', ['admin']), (req, res, next) => {
  User.find({}, {_id: 0, __v: 0, password: 0}, (err, users) => {
    if (err) return _EUNEXP(res, err, {
      users: users
    });
    if (users.length == 0) {
      return _FAIL(res, 'U_NF');
    } else {
      return _SUCC(res, {
        users: users
      });
    }
  });
});

router.post('/', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  User.findOne({email: req.body.user.email}, (err, found) => {
    if (err) return _EUNEXP(res, err, {
      user: req.body.user
    });
    User.createNew(req.body.user, (err, ret) => {
      if (err) return _EUNEXP(res, err, {
        user: req.body.user,
        ret: ret
      });
      return _CREATED(res, 'User', {
        ret: ret
      });
    });
});

router.get('/:uid/sessions', jwtValidate('utype', ['admin', 'staff', 'participant']), (req, res, next) => {

});

router.post('/:uid/sessions', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {

});

router.delete('/:uid/sessions/:sid', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {

});

module.exports = router;
