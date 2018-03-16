import express from 'express';
const router = express.Router();

import {_EUNEXP, _SUCC, _FAIL} from '../util';

import {jwtValidate} from '../middleware/jwt';

import Session from '../models/session';

router.get('/', jwtValidate('utype', ['admin', 'staff']), (req, res, next) => {
  Session.find({})
    .then(found => {
      if (found.length != 0) {
        return _SUCC(res, {
          sessions: found
        });
      } else {
        return _FAIL(res, 'S_NF');
      }
    })
    .catch(err => {
      return _EUNEXP(res, err);
    });
});

module.exports = router;
