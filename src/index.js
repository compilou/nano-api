/**
 * μ Nano API
 *
 * Just a prototype.
 *
 * @author John Murowaniecki <jmurowaniecki@gmail.com>
 * @link   https://github.com/compilou/nano-api
 *
 */
const cookieSession = require('cookie-session');
const Controllers = require('./controllers');
const SocketIO = require('socket.io');
const Express = require('express');
const Cluster = require('cluster');
const Routes = require('./routes');
const { ƒ } = require('src/.../index');
const FS = require('fs');
const OS = require('os');

const {
  PORT = 80,
} = process.env;

class μ {

  log(...message) {
    if (this.config.DEBUG) {
      console.debug(...message);
    }
  }



  Endpoints() {
    const Interface = OS.networkInterfaces();
    const Addresses = [];

    Object.keys(Interface).forEach((n) => {
      Interface[n].forEach((addr) => {
        Addresses.push(addr.address.concat(':', this.config.PORT));
      });
    });
    return Addresses;
  }



  constructor(...arg) {
    this.Cluster = Cluster;
    this.config = {
      DEBUG: false,
      PORT: PORT,
    };

    arg.forEach((configs) => {
      if (typeof configs === 'object') {
        Object.keys((configs))
          .forEach(((config) => (this.config[config] = configs[config])));
      }
    });
  }



  isRunning() {
    return FS.existsSync('.pid');
  }



  start(callback) {
    FS.writeFileSync('.pid', process.pid);

    this.Server = Express();
    this.Server
      .use(Express.json())

      .use((req, res, next) => {
        req.io = this.Notifier;
        next();
      })

      .get('/status', (req, res) => res.send(JSON.stringify({
        CPU: ƒ(OS.cpus()).do((p, e) => [p.map((cpuInfo) => (e = cpuInfo.model, cpuInfo.speed)), e]),
        RAM: ƒ(OS.freemem()).do((e) => [parseInt(e / (1024 ** 2), 10), 'MB']),
      })));

    this.Gateway = this.Server.listen(
      this.config.PORT,
      () => {
        process.title = `μ.${['Worker', 'Master'][this.Cluster.isMaster + 0]}`;
        this.log([process.title, process.pid], 'using port:', this.config.PORT, 'on', this.Endpoints());
      });

    this.Notifier = SocketIO(this.Gateway);

    if (typeof callback === 'function') {
      callback(this);
    }

    return this;
  }



  shutdown(description, callback) {
    this.isRunning() && FS.unlinkSync('.pid');
    this.log('Preparing to shutdown', [process.title, description || '']);

    this.Gateway.close();

    setTimeout(() => {
      if (callback && typeof callback === 'function') {
        callback.call(this);
      }
    }, 666);
  }
}



if (module !== require.main) {
  module.exports = μ;
}
else {
  const Application = new μ({
    DEBUG: false,
  }).start();

  // ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM' , 'uncaughtException']
  //   .forEach((event) => process.on(event, () => Application.shutdown(event)));

  Application
    .Server

    .use((req, res, next) => {
      const acw = 'Access-Control-Allow';
      res
        .header(`${acw}-Origin`, '*')
        .header(`${acw}-Headers`, 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    })
    .use(cookieSession({ name: 'session', keys: ['auth'] }))
    .use((req, res, next) => {
      req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
      next();
    })
    .use(Express.static('./public'));

  Application.Server.ACTIVE_USERS = [];

  Routes(Application.Server, Controllers);

  setInterval(() => {
    Application.Server.emit('ping', '1');
    console.log('Users', Application.Server.ACTIVE_USERS);
  }, 3000);

}
