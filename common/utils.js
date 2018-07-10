const pino = require('pino')();

const Utils = {

  error: function(errMsg, statusCode, err, code) {
    let json = {
      status: false,
      error: {
        code: (code || statusCode),
        msg: errMsg
      }
    };

    pino.error(err, errMsg);
    return json;
  },

  responseSuccess: function(res, pageInfo, data, status) {
    res.status(status || 200);
    return res.json({
      status: true,
      page: pageInfo,
      data: data
    });
  },

  responseError: (res, err, errMsg) => {
    res.status(500);
    return res.json(Utils.error(errMsg || 'Internal Server Error.', 500, err));
  },

  responseErrorNotFound: (res, err) => {
    res.status(404);
    return res.json(Utils.error(errMsg || 'Resource Not Found.', 404, err));
  },

  responseErrorUnauthorized: (res, err, errMsg, code) => {
    res.status(401);
    return res.json(Utils.error(errMsg || 'Un-Authorised Access.', 401, err, code));
  },

  responseErrorForbidden: (res, err, errMsg) => {
    res.status(403);
    return res.json(Utils.error(errMsg || 'Forbidden.', 403, err));
  },

  responseErrorBadRequest: (res, err, errMsg) => {
    res.status(400);
    return res.json(Utils.error(errMsg || 'Bad Request', 400, err));
  },

  responseErrorConflict: (res, err, errMsg) => {
    res.status(409);
    return res.json(Utils.error(errMsg || 'conflict', 409, err));
  }

}

module.exports = Utils;
