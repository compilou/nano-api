const Controller = require('./controller');

class Deliberation extends Controller {
  get(req, res) { console.log('get', res.json(['get', this.customPath])); }
  put(req, res) { console.log('put', res.json(['put', this.customPath])); }
  post(req, res) { console.log('post', res.json(['post', this.customPath])); }
  patch(req, res) { console.log('patch', res.json(['patch', this.customPath])); }
  delete(req, res) { console.log('delete', res.json(['delete', this.customPath])); }
}

module.exports = Deliberation;
