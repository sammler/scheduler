const AppServer = require('./../../src/app-server');
const defaultConfig = require('./../../src/config/config');

describe.only('app-server', () => {

  it('has some methods', () => {
    let appServer = new AppServer();
    expect(appServer).to.have.a.property('start').to.be.a('function');
    expect(appServer).to.have.a.property('stop').to.be.a('function');
  });

  it('has some default env variables', () => {
    let config = {};
    let appServer = new AppServer(config);

    // Checking default values
    expect(appServer.config.NODE_ENV).to.be.equal(defaultConfig.NODE_ENV);
    expect(appServer.config.PORT).to.be.equal(defaultConfig.PORT);


  });

  it('allows to change env variables', () => {
    process.env.NODE_ENV = 'production';
    let appServer = new AppServer();
    expect(appServer.config.NODE_ENV).to.be.equal('production');
    expect(appServer.config.PORT).to.be.equal(defaultConfig.PORT); // Still the default value

  });

  it('allows to pass in values to override env variables', () => {

    let config = {
      PORT: 5000
    };
    let appServer = new AppServer(config);
    expect(appServer.config.PORT).to.be.equal(config.PORT);

  });

});
