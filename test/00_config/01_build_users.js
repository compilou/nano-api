const {
  killSwitch,
  passwordMaker,
} = require('../../src/...');

const Model = require('../../src/model')([
  'user',
]);

const {
  SandboxUsers,
} = require('../../src/lib/utils');



'Usuários administrativos'
  .testList(() => {
    const Users = SandboxUsers;
    const Fails = [];


    'Usuários criados/senhas reiniciadas'
      .test((done) => {

        const seed = [];
        const last = Users.length - 1;
        const isFinished = () => this.finished = (seed.push(1), seed.length >= last);

        Users.forEach((user) => {
          Model.User.findOne({ username: user.username }, user, (err, found) => {
            let new_user = (!err && !found) ? user : false;

            if (new_user) {
              new_user.createdAt = new Date();
              new_user.password = passwordMaker(new_user.password);

              Model.User.create(user, (err) => (err ? Fails.push(user) : false));
            } else {
              if (err) {
                Fails.push(user);
              } else {
                found.password = passwordMaker(user.password);
                found.updatedAt = new Date();
                found.save();
              }
            }
            isFinished();
          });
        });

        const STALL = (new Date()).getTime() + 5000;

        this.interval = setInterval(() => {
          const isStalled = (new Date()).getTime() - STALL ;
          if (this.finished || isStalled > 0) {
            clearInterval(this.interval);

            this.interval = null;
            this.finished = null;

            delete(this.interval);
            delete(this.finished);
            Model.DB.disconnect();

            return done();
          }
          process.stdout.write('.');
        }, 100);
      }, 10000);

    killSwitch();
  });
