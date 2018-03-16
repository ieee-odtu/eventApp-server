import express from 'express';
const router = express.Router();

import {_EUNEXP, _SUCC, _FAIL, asyncWrap} from '../util';

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
  
}));

router.get('/:sid', jwtValidate('utype', ['admin', 'staff']), asyncWrap(async (req, res, next) => {

}));

router.delete('/:sid', jwtValidate('utype', ['admin']), asyncWrap(async (req, res, next) => {

}));

module.exports = router;
