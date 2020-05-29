function isAuthorized (requisition) {
  const [REQUISITION_HEADER] = [(requisition.header('X-Authorization-Key') || '').split(':').pop().trim()];
  return (REQUISITION_HEADER === process.env.APP_KEY ||
      (((requisition.session &&
        (requisition.session.auth &&
        (requisition.session.auth.admin))))));
}


function UpdateSession (request, session, scope) {
  session.lastLogin = (new Date()).getTime();
  session.save();

  if (!scope.ACTIVE_USERS) {
    scope.ACTIVE_USERS = [];
  }

  scope.ACTIVE_USERS[session.id] = {
    activity: session.lastLogin,
    alias: session.fullname
  };

  return request.session.session = {
    lastLogin: session.lastLogin,
    fullname: session.fullname,
    username: session.username,
    email: session.email,
    admin: session.admin,
    id: session.id
  };
}


function ClearSession (request, session, scope) {
  console.log('re', request, session, scope);

  if (!scope.ACTIVE_USERS) {
    scope.ACTIVE_USERS = [];
  }

  scope.ACTIVE_USERS[session.id] = null;
  delete(scope.ACTIVE_USERS[session.id]);

  request.session = null;
  delete(request.session);

  return request.session;
}


const ACL = (...args) => {
  const callback = args[args.length - 1],
    [ req, res ] = args;

  if (typeof callback === 'function') {
    return callback.call(this,!!(
      req &&
        req.session), req, res);
  }
  return;
};

module.exports = {
  isAuthorized,
  ClearSession,
  UpdateSession,
  ACL
};
