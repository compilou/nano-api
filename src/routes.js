class ROUTES {
  constructor (Server, routes) {
    const ALLOWED_VERBS = ['post', 'put', 'get', 'patch', 'delete', 'head', 'connect', 'options', 'trace'];
    console.log('deu perda');

    Object.keys(routes).forEach(route => {
      console.log('>', route);
      const path = route;
      const ROUTE = routes[route];
      const routing = new ROUTE();

      Reflect
        .ownKeys(ROUTE.prototype)
        .filter(((verb) => ALLOWED_VERBS.indexOf(String(verb)) >= 0))
        .forEach((verb) => {
          Server[(verb)](`/${path}`, routing[verb].bind(Server));
          console.log(`Adding route /${path}`, routing[verb]);
        });
    });
  }

  notFound (req, res, next) {
    console.log(req);
    res.json(next);
  }
}

module.exports = (server, routes) => new ROUTES(server, routes);
