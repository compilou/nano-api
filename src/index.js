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

const IPC = require('node-ipc');

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
    const hierarchy = ['Worker', 'Master'][Cluster.isMaster+0];
    this.daemon = this.constructor.name.concat('.', hierarchy);
    this.thread = this.handleIPC(Cluster);
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


  handleIPC(Cluster) {
    process.title = `${this.daemon}...`;
    Object.assign(IPC.config, {
      id: `${this.daemon}...`,
      retry: 1500,
      silent: true
    });
    IPC.connectTo(this.daemon, () => {
      IPC.of['jest-observer'].on('connect', () => {
        IPC.of['jest-observer'].emit('beam', 'die');
        IPC.serve(() => IPC.server.on(this.daemon, (signal) => {
          console.log('signal received:', signal);
          process.exit(0);
        }));
        IPC.server.start();
      });
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

  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM' , 'uncaughtException']
    .forEach((event) => process.on(event, () => Application.shutdown(event)));



  process.argv.forEach((arg) => {
    switch (arg) {
      case 'bend':

        Application.Server.emit('request', 'bend');
        process.exit(0);
        break;

      default:
        console.log('arg', arg);
        break;
    }
  });


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

  Routes(Application.Server, Controllers);


  Application.Server.on('request', (request) => {
    console.log('do it', request);
  });

  setInterval(() => {
    Application.Server.emit('ping', '1');
    console.log('Users', Application.Server.ACTIVE_USERS);
  }, 3000);

}
