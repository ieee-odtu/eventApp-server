import uuidV4 from 'uuid/v4';

import _jwt from './middleware/jwt';
import errcodes from './config/ec';

import User from './models/user';

function get_status_or_500(code) {
  return (typeof errcodes[code] != 'undefined') ? errcodes[code].stat : 500;
}

function _EUNEXP(res, err, debug, middleware) {
  console.log('In _EUNEXP');
  let response = {
    success: false,
    code: 'E_UNEXP',
    msg: 'Unexpected error',
    err: err
  }
  if (typeof debug == 'string') {
    response['middleware'] = debug;
  } else if (typeof debug == 'object') {
    response['debug'] = debug;
    if (typeof middleware == 'string') {
      response['middleware'] = middleware;
    }
  }
  console.log('[EUNEXP] debug:', debug, ' / middleware:', middleware);
  return res.status(500).json(response);
}

module.exports._EUNEXP = _EUNEXP;

module.exports._ERR = (res, err, debug, middleware) => {
  if (errcodes.includes(err)) {
    let response = {
      success: false,
      code: err
    }
    if (typeof debug == 'string') {
      response['middleware'] = debug;
    } else if (typeof debug == 'object' && typeof middleware == 'string') {
      response['debug'] = debug;
      response['middleware'] = middleware;
    }
    return res.status(get_status_or_500(err)).json(response);
  } else {
    return _EUNEXP(res, err, debug, middleware);
  }
}

module.exports._E_CAST = (res, err, code, status, debug, middleware) => {
  let response = {
    success: false,
    code: code
  }
  if (typeof debug == 'string') {
    response['middleware'] = debug;
  } else if (typeof debug == 'object' && typeof middleware == 'string') {
    response['debug'] = debug;
    response['middleware'] = middleware;
  }
  return res.status(status).json(response);
}

module.exports._CREATED = (res, model, debug) => {
  let response = {
    success: true,
    msg: 'New model instance has been created successfully',
    model: model
  }
  if (typeof debug == 'string') {
    response['middleware'] = debug;
  } else if (typeof debug == 'object' && typeof middleware == 'string') {
    response['debug'] = debug;
    response['middleware'] = middleware;
  }
  return res.status(201).json(response);
}

module.exports._SUCC = (res, prop) => {
  console.log('In _SUCC');
  let response = {
    success: true
  }
  console.log('Before Object.assign')
  response = Object.assign({}, prop, response);
  console.log('After Object.assign')
  return res.status(200).json(response);
}

module.exports._FAIL = (res, code, middleware) => {
  let response = {
    success: false,
    code: code
  }
  if (typeof middleware != 'undefined') {
    response['middleware'] = middleware;
  }
  //return res.status(get_status_or_500(code)).json(response);
  return res.json(response);
}

module.exports._generate_jti = () => {
  return uuidV4();
}

module.exports.rlog_mw = (req, res, next) => {
  console.log('\x1b[33m[' + req.method + ']\x1b[0m ' + req.originalUrl);
  next();
}
