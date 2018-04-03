import express from 'express';
const router = express.Router();

import {_EUNEXP, _SUCC, _FAIL, _CREATED, asyncWrap} from '../util';

import {jwtValidate} from '../middleware/jwt';

import Session from '../models/session';

router.get('/', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {
  let found = await Session.find({})
  if (found.length != 0) {
    return _SUCC(res, {
      sessions: found
    });
  } else {
    return _FAIL(res, 'S_NF');
  }
}));

router.post('/', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {
  let found = await Session.findOne({date: req.body.session.date, time: req.body.session.time})
  if (found) {
    return _FAIL(res, 'REG_SESS_DT');
  } else {
    await Session.createNew(req.body.session)
    return _CREATED(res, 'Session');
  }
}));

router.get('/:sid', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {
  let found = await Session.findById(req.params.sid)
  if (found) {
    return _SUCC(res, {
      session: found
    });
  } else {
    return _FAIL(res, 'S_NF');
  }
}));

router.delete('/:sid', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {
  let found = await Session.findById(req.params.sid)
  if (found) {
    await Session.remove({_id: found._id})
    return _REMOVED(res, 'Session', {
      id: found._id
    });
  } else {
    return _FAIL(res, 'S_NF');
  }
}));

module.exports = router;
