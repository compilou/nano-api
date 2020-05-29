const Chai = require('chai');
const httpChai = require('chai-http');

const BCrypt = require('bcrypt');

const passwordMaker = (password, DEFAULT) => BCrypt.hashSync((((password || DEFAULT || String(Math.random() * 666)))), 13);
const passwordMatch = (password, confirm) => BCrypt.compareSync(password || '+', confirm || '-');

const delay = (timeout, callback) => new Promise((succes, failure) => {
  return setTimeout(() => callback(succes, failure), timeout);
});

String.prototype.test = function (callback, timeout, skippable) {
  new Promise((resolve) => {
    it(String(this), function (next) {
      if ((skippable > 0)) {
        setTimeout(() => (this.skip(), (next(), resolve())), skippable - 1);
      }
      callback.call(this, () => (next(), resolve()));
    }).timeout(timeout || 2000);
  });
};

String.prototype.skippable = function (callback, timeout, skippable) {
  return this.test(callback, timeout, (skippable || 2000));
};

String.prototype.testList = function(callback) {
  return new Promise((resolve) => {
    describe(String(this), function () {
      return callback.call(this, resolve);
    });
  });
}


Chai.use(httpChai);


module.exports = {
  expect: Chai.expect,

  extract: (from, keys) => {
    const temporary = {};
    keys.forEach((key) => {
      temporary[key] = from[key];
    });
    return temporary;
  },

  λ: Chai.request,

  λs: Chai.request.agent,

  delay: delay,

  passwordMaker,
  passwordMatch,

  ƒ: (ħ) => ({ do: (Ł) => Ł(ħ) }),

  killSwitch: () => setTimeout(() => process.exit(1), 500000),

};
