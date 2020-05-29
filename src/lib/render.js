
const Render = (response, data, code, details) => {
  const struct = (typeof data === 'string'
    ? {
      success: (code || 200) <= 400,
      message: data,
      details
    }
    : data);
  return response.status(code || 200)
    .send(struct);
};

const ACTION = (function () {
  this.code = 200;
  this.list = [];

  this.do = (message) => (this.list.push(message), this);
  this.with = (code) => (this.code = code, this);
  this.summary = () => ({
    code: this.code,
    list: this.list
  });
  this.Render = (res) => console.log('ACTION', this.list.join(' '), this.code, res);

  return this;
})();

const RENDER_UNPRIVILEDGED = (res) => Render(
  res,
  'Você não pode fazer isso.',
  403
);

const RENDER_CALM_DOWN = (res) => Render(
  res,
  'Acalme-se. Você não pode fazer isso..',
  420
);

const RENDER_BAD_REQUEST = (res) => Render(
  res,
  'Sintaxe inválida.',
  400
);

module.exports = {
  Render,
  ACTION,
  RENDER_UNPRIVILEDGED,
  RENDER_CALM_DOWN,
  RENDER_BAD_REQUEST
};
