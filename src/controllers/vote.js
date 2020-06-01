const Controller = require('./controller');
const ORM = require('../model');
const Model = ORM(['meeting', 'deliberation', 'vote']);
const { Render, RENDER_UNPRIVILEDGED } = require('../lib/render');
const { ACL } = require('../lib/ACL');

const buildStats = (deliberations) => {
  const sim = deliberations.votes.filter((vote) => vote.value === 'sim').length;
  const nao = deliberations.votes.length - sim;
  return {
    text: deliberations.text,
    nao: nao,
    sim: sim,
  };
};

const buildVote = (user, value) => ({
  createdAt: new Date(),
  user: user,
  value: value
});

class Vote extends Controller {

  put(req, res) {
    return ACL(req.session, res, ((allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }

      Model.Meeting
        .find({ _id: req.body._id })
        .limit(1)
        .exec((err, meetings) => {
          if (err || !meetings.length) {
            return Render(res, 'Esta reunião não está com votação ativa ou não existe.', 404);
          }
          const meeting = meetings.pop();
          meeting.deliberations
            .forEach((e, p) => {
              if (e.id === req.body.deliberation.id) {
                meeting.deliberations[p].votes.push(buildVote(req.session.session.id, req.body.deliberation.value));
              }
            });
          meeting.save();
          Render(res, meeting, 200);
        });
    }));
  }

  get(req, res) {
    return ACL(req.session, res, ((allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      Model.Meeting
        .find({
          sheduled: ((d, e) => (e = new Date(d), {
            $gte: e,
            $lte: new Date(new Date(d).setDate(e.getDate()+5))
          }))((new Date()).toLocaleDateString()),
          status: true
        })
        .limit(2)
        .exec((err, meetings) => err
          ? Render(res, 'Nenhuma reunião agendada.', 404)
          : Render(res, meetings, 200));
    }));
  }

  post(req, res) {
    return ACL(req.session, res, ((allow) => {
      if (!allow) {
        return RENDER_UNPRIVILEDGED(res);
      }
      if (req.body.id) {
        req.body._id = req.body.id;
        delete(req.body.id);
      }

      Model.Meeting
        .findOne(req.body)
        .exec((err, meeting) => {
          if (err) {
            return Render(res, 'Nenhuma reunião agendada.', 404);
          }
          if (meeting.deliberations) {
            for (let n = 0; n < meeting.deliberations.length; n++) {
              meeting.deliberations[n] = buildStats(meeting.deliberations[n]);
            }
          }
          Render(res, meeting, 200);
        });
    }));
  }
}

module.exports = Vote;
