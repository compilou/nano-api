
((tests) => {
  tests.forEach( async (test) => await test()
    .then((result) => console.warn('test', test, result))
    .catch((err) => console.warn('fail', test, err))
    .finally(() => console.warn('ended', test)));
})([
  () => new Promise((done, fail) => {
    try {
      require('./00_config/00_environment');
    } catch (error) {
      fail();
    }
    done();
  }),
  () => new Promise((done, fail) => {
    try {
      require('./00_config/01_build_users');
    } catch (error) {
      fail();
    }
    done();
  }),
  () => new Promise((done, fail) => {
    try {
      require('./01_unit/00_check_main_structure');
    } catch (error) {
      fail();
    }
    done();
  }),
  () => new Promise((done, fail) => {
    try {
      require('./01_unit/01_check_route_injection');
    } catch (error) {
      fail();
    }
    done();
  }),
  () => new Promise((done, fail) => {
    try {
      require('./02_acceptance/00_flow_auth');
    } catch (error) {
      fail();
    }
    done();
  }),
  () => new Promise((done, fail) => {
    try {
      require('./02_acceptance/01_flow_meeting');
    } catch (error) {
      fail();
    }
    done();
  })
]);
