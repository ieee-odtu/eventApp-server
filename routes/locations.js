import express from 'express';
const router = express.Router();

import {_EUNEXP, _SUCC, _FAIL, _CREATED, asyncWrap} from '../util';

import {jwtValidate} from '../middleware/jwt';

import Location from '../models/location';

router.get('/', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {
  let found = await Location.find({})
  if (found.length != 0) {
    return _SUCC(res, {
      Locations: found
    });
  } else {
    return _FAIL(res, 'S_NF');
  }
}));

router.post('/', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {
  let found = await Location.findOne({date: req.body.location.date, time: req.body.location.time})
  if (found) {
    return _FAIL(res, 'REG_SESS_DT');
  } else {
    await Location.createNew(req.body.location)
    return _CREATED(res, 'Location');
  }
}));

router.get('/:sid', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {
  let found = await Location.findById(req.params.sid)
  if (found) {
    return _SUCC(res, {
      Location: found
    });
  } else {
    return _FAIL(res, 'S_NF');
  }
}));

router.delete('/:sid', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {
  let found = await Location.findById(req.params.sid)
  if (found) {
    await Location.remove({_id: found._id})
    return _REMOVED(res, 'Location', {
      id: found._id
    });
  } else {
    return _FAIL(res, 'S_NF');
  }
}));

module.exports = router;
