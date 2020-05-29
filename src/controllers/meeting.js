const Controller = require('./controller');
const ORM = require('../model');
const Model = ORM(['meeting', 'deliberation']);

const { Render, RENDER_UNPRIVILEDGED } = require('../lib/render');
const { ACL } = require('../lib/ACL');
const { saveOne } = require('../lib/utils');


class Meeting extends Controller {
  put(req, res) { console.log('put', res.json(['put', this.customPath])); }
  patch(req, res) { console.log('patch', res.json(['patch', this.customPath])); }
  delete(req, res) { console.log('delete', res.json(['delete', this.customPath])); }

  get(req, res) {
    return ACL(req.session, res, (allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      Model.Meeting
        .find(req.body)
        .sort('-id')
        .limit(42)
        .exec((err, meetings) => err
          ? Render(res, 'Ocorreu um erro durante a listagem de assembléias.', 517, [err, meetings])
          : Render(res, meetings || []));
    });
  }

  post(req, res) {
    return ACL(req.session, res, (allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      const posted = req.body;
      posted.createdAt = new Date();
      // posted.deliberations.forEach((e) => {
      //   e.createdAt = new Date();
      // });

      console.log(posted,'mtfck');

      saveOne(Model.Meeting, posted)
        .then((saved) => {
          console.log('veio antes de qqr coisa?', saved)
        })
        .then((saved) => Render(res, `Cadastro de assembléia realizado para ${saved.title}.`, 201, posted))
        .catch((erro) => console.log('>>>>', erro) && Render(res, `Falha ao cadastrar ${posted.title}.`, 500, [erro, posted, erro]))
        .finally((ok) => {
          console.log('ok', ok);
        });
    });
  }
}

module.exports = Meeting;
