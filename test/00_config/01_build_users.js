const {
  passwordMaker,
  delay,
} = require('../../src/...');

const Model = require('../../src/model')([
  'user',
]);

const {
  SandboxUsers,
} = require('../../src/lib/utils');

const Users = SandboxUsers;
const Fails = [];


'Usuários administrativos'
  .testList(() => {

    'Usuários criados/senhas reiniciadas'
      .test((done) => {

        const seed = [];
        const last = Users.length - 1;
        const userCreated = () => this.finished = (seed.push(1), seed.length >= last);

        delay(5000, () => {

          Users.forEach((user) => {
            Model.User.findOne({ username: user.username }, (err, found) => {
              let new_user = (!err && !found) ? user : false;

              if (new_user) {
                new_user.createdAt = new Date();
                new_user.password = passwordMaker(new_user.password);

                Model.User.create(user, (err) => {
                  (err ? Fails.push(user) : false)
                });
              } else {
                if (err) {
                  Fails.push(user);
                } else {
                  found.password = passwordMaker(user.password);
                  found.updatedAt = new Date();
                  found.save();
                }
              }
              userCreated();
            });
          });
        });
        const STALL = (new Date()).getTime() + 5000;

        this.interval = setInterval(() => {
          const isStalled = (new Date()).getTime() - STALL;
          if (this.finished || isStalled > 0) {
            clearInterval(this.interval);

            this.interval = null;
            this.finished = null;

            delete(this.interval);
            delete(this.finished);

            try {
              Model.DB.disconnect();
              process.stdout.write('\r');
            } catch (error) {
              process.stdout.write('Error when closing DB\n');
            }
            // process.exit(22);
            return done();
          }
          process.stdout.write('.');
        }, 100);
      }, 10000);
  });
