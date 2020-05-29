module.exports = {
  SandboxUsers: [
    {
      fullname: 'Administrador',
      username: 'admin1',
      password: '@dm¡n1str4d0®',
      active: true,
      admin: true,
    },
    {
      fullname: 'Diretor',
      username: 'diretor1',
      password: '!$D1ret0r',
      active: true,
      admin: true,
    },
    {
      fullname: 'Secretário',
      username: 'secretario1',
      password: '123$56sete',
      active: true,
      admin: true,
    },
  ],
  SandboxCPF: (cpf) => {
    const VALIDATE = (cpf) => {
      const CPF = String(cpf).replace(/[^0-9]/g, '');
      // https://github.com/jmurowaniecki/common-mistakes/blob/master/validarCPF.js
      if (((CPF.length != 11 ||
        !CPF.match(/^[0-9]+$/) ||
        (CPF.replace(CPF.charAt(1), '') === '')))) {
        return false;
      } else {
        let c, n, d;
        for (n = 9; n < 11; n++) {
          for (d = 0, c = 0; c < n; c++) {
            d += CPF.charAt(c) * ((n + 1) - c);
          }
          d = ((10 * d) % 11) % 10;
          if (CPF.charAt(c) != d) {
            return false;
          }
        }
        return true;
      }
    };
    const GENERATE = () => {
      const RANDOM = () => ('' + Math.floor(Math.random() * 999)).padStart(3, '0');
      const DV = (...n) => {
        const nums = n.join('').split(''); let x = 0, y;
        if (n[3]) {
          nums[9] = n[3];
        }
        for (let i = (n[3] ? 11 : 10), j = 0; i >= 2; i--, j++) {
          x += parseInt(nums[j]) * i;
        }
        y = x % 11;
        return y < 2 ? 0 : 11 - y;
      };
      var dv, n = [];
      do {
        n = [RANDOM(), RANDOM(), RANDOM()];
        dv = DV(...n);
      } while (!VALIDATE(n.join('').concat(dv, DV(...n, dv))));

      return `${n[0]}.${n[1]}.${n[2]}-${dv}${DV(...n, dv)}`;
    };
    return (cpf
      ? VALIDATE(cpf)
      : GENERATE());
  },

  findOne: (DB) => ((data) => new Promise((resolve, reject) => DB.findOne(data, (err, found) => err ? reject({ error: err }) : (found ? resolve(found) : reject({ found: found }))))),
  saveOne: (DB, data) => new Promise((resolve, reject) => DB.create(data, (err, saved) => err ? reject(err) : resolve(saved))),

};
