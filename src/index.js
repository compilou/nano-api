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


  /**
   * Creates an instance of μ // Nano-API.
   *
   * @param {any|array|object} arg Object(s) with configurations:
   *  {
   *    DEBUG {boolean} Shows common output for main processes.
   *    UNITE {boolean} Doesn't kill existant services (only UNITE it).
   *    PORT  {number}  Port number for express/http application.
   *  }
   *
   * @memberOf μ
   */
  constructor(...arg) {
    this.config = {
      DEBUG: false,
      UNITE: false,
      PORT: PORT,
    };

    arg.forEach((configs) => {
      if (typeof configs === 'object') {
        Object.keys((configs))
          .forEach(((config) => (this.config[config] = configs[config])));
      }
    });

    this.daemon = [
      this.constructor.name,
      ['Worker', 'Master'][Cluster.isMaster+0],
      this.config.UNITE ? '+' : null
    ].filter(i => i).join('.');

    process.title = this.daemon;

    this.handlePID();
  }



  handlePID() {
    if (!this.config.UNITE) {
      let isRunning = this.isRunning();
      if (isRunning) {
        try {
          process.kill(isRunning, 9);
          this.log('Killed', isRunning);
        } catch (error) {
          this.log('Can`t kill', isRunning, error);
        }
      }
      FS.writeFileSync('.pid', process.pid);
    }
  }



  isRunning() {
    if (this.config.UNITE) {
      return process.pid;
    }
    return FS.existsSync('.pid') ? FS.readFileSync('.pid') : false;
  }



  start(callback) {
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
    this.Gateway.removeAllListeners();
    this.Gateway.close();
    this.Gateway.unref();

    setTimeout(() => {
      if (callback && typeof callback === 'function') {
        callback.call(this);
      }
      setTimeout(() => process.exit(0), 42000);
    }, 666);
  }
}



if (module !== require.main) {
  module.exports = μ;
}
else {
  const Application = new μ({
    DEBUG: true,
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
    .use(Express.static('./docs'))
    .use(Express.static('./public'));

  Application.Server.ACTIVE_USERS = [];

  Routes(Application, Controllers);


  setInterval(() => {
    Application.log('Active users', Application.Server.ACTIVE_USERS);
  }, 1000);

}
