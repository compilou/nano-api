const Controller = require('./controller');
const ORM = require('../model');
const Model = ORM(['user']);

const { Render, RENDER_UNPRIVILEDGED, RENDER_BAD_REQUEST } = require('../lib/render');
const { ACL } = require('../lib/ACL');

class User extends Controller {

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
      if (!req.body) {
        return RENDER_BAD_REQUEST(res);
      }
      if (req.body.id) {
        req.body._id = req.body.id;
        delete(req.body.id);
      }
      Model.User.countDocuments(req.body, (error, users) => {
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
   *    @httpStatus 200 If the user was found and sent to deletion.
   *    @httpStatus 403 If user aren't authenticated.
   *    @httpStatus 404 If there wasn't found by a bad request or something.
   *    @httpStatus 500 In case of errors.
   */
  get(req, res) {
    return ACL(req.session, res, (allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      if (!req.body) {
        return RENDER_BAD_REQUEST(res);
      }
      if (req.body.id) {
        req.body._id = req.body.id;
        delete(req.body.id);
      }
      Model.User
        .find(req.body)
        .exec((error, users) => {
          if (error) {
            return Render(res, 'Usuário(s) não localizado(s)', 404);
          }
          Render(res, users);
        });
    });
  }
}

module.exports = User;
