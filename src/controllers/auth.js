const Controller = require('./controller');
const ORM = require('../model');
const Model = ORM(['user']);

const { passwordMatch, passwordMaker } = require('../...');
const { Render, RENDER_UNPRIVILEDGED } = require('../lib/render');
const { ACL, UpdateSession, ClearSession } = require('../lib/ACL');
const { SandboxCPF, findOne, saveOne } = require('../lib/utils');


class Auth extends Controller {

  put(req, res) { console.log('put', res.json(['put', this.customPath])); }
  patch(req, res) { console.log('patch', res.json(['patch', this.customPath])); }

  get(req, res) {
    return ACL(req.session, res, ((allow) => allow
      ? Render(res, req.session.session)
      : RENDER_UNPRIVILEDGED(res)));
  }

  delete(req, res) {
    return ACL(req.session, res, ((allow) => {
      const user = req.session.session.fullname;
      if (allow) {
        ClearSession(req, req.session.session, this);
        return Render(res, `Até breve ${user}`);
      }
      RENDER_UNPRIVILEDGED(res);
    }));
  }

  post(req, res) {
    const auth = req.body;
    const UserCollection = Model.User;
    const UserAPI = findOne(UserCollection);

    UserAPI({ username: auth.username })
      .then((found) => passwordMatch(req.body.password, found.password)
        ? (UpdateSession(req, found, this) && Render(res, `Bem vindo, ${found.fullname}.`, 200, found))
        : Render(res, `Usuário ${found.username} ou senha incorretos.`, 403, [found, req.body]))

      .catch((error) => {
        console.log('ops', error, auth);

        if (((error && error.found !== null)) || !SandboxCPF(req.body.username)) {
          return Render(res, `Falha ao localizar '${req.body.username}'.`, 403);
        }

        const user = req.body;
        user.createdAt = new Date();
        user.fullname = user.username;
        user.username = user.username.replace(/[^0-9]/g, '');
        user.active = true;
        user.admin = false;
        user.dummy = req.header('IS-DUMMY');

        return UserAPI({ username: user.username }, { username: user.username })
          .then((found) => Render(res, `Cadastro localizado: ${found.fullname}.`, 309))
          .catch(() => {
            user.password = passwordMaker(user.password);
            return saveOne(UserCollection, user)
              .then((saved) => Render(res, `Cadastro realizado para ${saved.fullname}.`, 201, user))
              .catch((erro) => Render(res, `Falha ao cadastrar ${user.username}.`, 500, [user, erro]));
          });
      });
  }
}

module.exports = Auth;
