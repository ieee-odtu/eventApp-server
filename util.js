import _jwt from './middleware/jwt';
import errcodes from './config/ec';

import User from './models/user';

function get_status_or_500(code) {

}

module.exports._EUNEXP = (res, err, debug, middleware) => {
  let response = {
    success: false,
    code: 'E_UNEXP',
    msg: 'Unexpected error',
    err: err
  }
  if (typeof debug == 'string') {
    response['middleware'] = debug;
  } else if (typeof debug == 'object' && typeof middleware == 'string') {
    response['debug'] = debug;
    response['middleware'] = middleware;
  }
  return res.status(500).json(response);
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
  let response = {
    success: true
  }
  response = Object.assign({}, prop, response);
  return res.status(200).json(response);
}

module.exports._FAIL = (res, code) => {
  return res.status(get_status_or_500(code)).json({
    success: false,
    code: code
  });
}

module.exports.rlog = (req) => {
  let whois, ccode;
  if (req.user == _jwt.constants.U_UNREG) {
    whois = req.user;
    ccode = "\x1b[31m";
  } else {
    whois = req.user.username;
    ccode = User.ccodes[req.user.utype];
  }
  console.log('[' + req.method + '] ' + req.originalUrl + ' <==> ' + ccode + whois + "\x1b[0m");
}

module.exports.rlog_mw = (req, res, next) => {
  let whois, ccode;
  if (req.user == _jwt.constants.U_UNREG) {
    whois = req.user;
    ccode = "\x1b[31m";
  } else {
    whois = req.user.username;
    ccode = User.ccodes[req.user.utype];
  }
  console.log('[' + req.method + '] ' + req.originalUrl + ' <==> ' + ccode + whois + "\x1b[0m");
  next();
}
