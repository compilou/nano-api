const Controller = require('./controller');
const ORM = require('../model');
const Model = ORM(['meeting', 'deliberation']);

const { Render, RENDER_UNPRIVILEDGED, RENDER_BAD_REQUEST } = require('../lib/render');
const { ACL } = require('../lib/ACL');
const { saveOne } = require('../lib/utils');

/**
 * A simple wrapper for HTTP verb/methods.
 *
 * @class Meeting
 * @extends {Controller}
 */
class Meeting extends Controller {

  patch(req, res) { console.log('patch', res.json(['patch', this.customPath])); }

  /**
   * Wrapper for DELETE verb/method.
   *
   * @param {*} req Express Request instance.
   * @param {*} res Express Response instance.
   * @returns Promiseable
   * @memberof Meeting
   *
   * Possible responses/status codes - via Express/HTTP interface:
   *    @httpStatus 202 If the document was found and sent to deletion.
   *    @httpStatus 400 If there wasn't found by a bad request or something.
   *    @httpStatus 403 If user aren't authenticated.
   *    @httpStatus 500 In case of errors.
   */
  delete(req, res) {
    return ACL(req.session, res, (allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      if (!(req.body && req.body.id)) {
        return RENDER_BAD_REQUEST(res);
      }
      if (req.body.id) {
        req.body._id = req.body.id;
        delete(req.body.id);
      }
      Model.Meeting
        .countDocuments(req.body, (error, users) => {
          const [ text, code ] = [
            `Removendo ${users.deletedCount} usuario${users.deletedCount > 1 ? 's' : ''}..`,
            error ? 404 : 202,
          ];
          Render(res, text, code);
        })
        .deleteMany(req.body, (error) => {
          console.log(error ? 'Houveram erros.' : 'Com sucesso.', req.body);
        })
        .exec(() => console.log('Finalizou exclusão.', req.body));
    });
  }

  /**
   * Wrapper for GET verb/method.
   *
   * @param {*} req Express Request instance.
   * @param {*} res Express Response instance.
   * @returns Promiseable
   * @memberof Meeting
   *
   * Possible responses/status codes - via Express/HTTP interface:
   *    @httpStatus 200 With a meetings list.
   *    @httpStatus 403 If user aren't authenticated.
   *    @httpStatus 500 In case of errors.
   *    @httpStatus 517 In case of errors.
   */
  get(req, res) {
    return ACL(req.session, res, (allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      const filter = {};
      const fields = {
        sheduled: (d, e) => (e = new Date(d), {
          $gte: e,
          $lte: new Date(new Date(d).setDate(e.getDate()+1))
        })
      };

      Object.keys(req.body).forEach((field) => {
        if (field in fields) {
          filter[field] = fields[field](req.body[field]);
        }
      });

      Model.Meeting
        .find(filter)
        .limit(42)
        .exec((err, meetings) => err
          ? Render(res, 'Ocorreu um erro durante a listagem de assembléias.', 517, [err, meetings])
          : Render(res, meetings || [], 200, meetings));
    });
  }

  /**
   * Wrapper for POST verb/method.
   *
   * @param {*} req Express Request instance.
   * @param {*} res Express Response instance.
   * @returns Promiseable
   * @memberof Meeting
   *
   * Possible responses/status codes - via Express/HTTP interface:
   *    @httpStatus 201 With meeting data.
   *    @httpStatus 403 If user aren't authenticated.
   *    @httpStatus 500 In case of errors.
   */
  post(req, res) {
    return ACL(req.session, res, (allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      const posted = req.body;
      posted.createdAt = new Date();
      posted.deliberations.forEach((e) => {
        e.createdAt = new Date();
      });

      return saveOne(Model.Meeting, posted)
        .then((saved) => Render(res, `Cadastro de assembléia realizado para "${posted.title}".`, 201, saved))
        .catch((erro) => Render(res, `Falha ao cadastrar "${posted.title}".`, 500, [erro, posted, erro]));
    });
  }
}

module.exports = Meeting;
