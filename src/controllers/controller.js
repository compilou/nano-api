class Controller {

  constructor(DB) {
    this.DB = DB;
    this.ALOWED_METHODS = ['post', 'put', 'get', 'patch', 'delete', 'head', 'connect', 'options', 'trace'];
  }

  // get(req, res) { console.log('de', res.json(['devil', this.customPath])); }
  // put(req, res) { console.log('put', res.json(['put', this.customPath])); }
  // post(req, res) { console.log('post', res.json(['post', this.customPath])); }
  // patch(req, res) { console.log('patch', res.json(['patch', this.customPath])); }
  // delete(req, res) { console.log('delete', res.json(['delete', this.customPath])); }
}

module.exports = Controller;
