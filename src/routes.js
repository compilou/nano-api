class ROUTES {
  constructor (Application, routes) {
    const ALLOWED_VERBS = ['post', 'put', 'get', 'patch', 'delete', 'head', 'connect', 'options', 'trace'];
    const Server = Application.Server;

    this.log = (...msg) => Application.log(...msg);

    Object.keys(routes).forEach(route => {
      const path = route;
      const ROUTE = routes[route];
      const routing = new ROUTE();

      Reflect
        .ownKeys(ROUTE.prototype)
        .filter(((verb) => ALLOWED_VERBS.indexOf(String(verb)) >= 0))
        .forEach((verb) => {
          Server[(verb)](`/${path}`, routing[verb].bind(Server));
          this.log(`Adding method ${routing[verb].name.toUpperCase()} to /${path}`);
        });
    });
  }

  notFound (req, res, next) {
    this.log(req);
    res.json(next);
  }
}

module.exports = (Application, routes) => new ROUTES(Application, routes);
