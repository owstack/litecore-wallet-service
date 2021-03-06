'use strict';

var should = require('chai').should();
var proxyquire = require('proxyquire');
var ltcLib = require('@owstack/ltc-lib');
var sinon = require('sinon');
var Service = require('../ltc-node');
var Constants = require('../lib/common/constants');

describe('ltcLib Node Service', function() {
  describe('#constructor', function() {
    it('https settings from node', function() {
      var node = {
        https: true,
        httpsOptions: {
          key: 'key',
          cert: 'cert'
        }
      };
      var options = {
        node: node
      };
      var service = new Service(options);
      service.node.should.equal(node);
      service.https.should.equal(true);
      service.httpsOptions.should.deep.equal({
        key: 'key',
        cert: 'cert'
      });
      service.ltcwsPort.should.equal(3232);
      service.messageBrokerPort.should.equal(3380);
      service.lockerPort.should.equal(3231);
    });
    it('direct https options', function() {
      var node = {};
      var options = {
        node: node,
        https: true,
        httpsOptions: {
          key: 'key',
          cert: 'cert'
        }
      };
      var service = new Service(options);
      service.https.should.equal(true);
      service.httpsOptions.should.deep.equal({
        key: 'key',
        cert: 'cert'
      });
      service.ltcwsPort.should.equal(3232);
      service.messageBrokerPort.should.equal(3380);
      service.lockerPort.should.equal(3231);
    });
    it('can set custom ports', function() {
      var node = {};
      var options = {
        node: node,
        ltcwsPort: 1000,
        messageBrokerPort: 1001,
        lockerPort: 1002
      };
      var service = new Service(options);
      service.ltcwsPort.should.equal(1000);
      service.messageBrokerPort.should.equal(1001);
      service.lockerPort.should.equal(1002);
    });
  });
  describe('#readHttpsOptions', function() {
    var TestService = proxyquire('../ltc-node', {
      fs: {
        readFileSync: function(arg) {
          return arg;
        }
      }
    });
    it('will create server options from httpsOptions', function() {
      var options = {
        node: {
          https: true,
          httpsOptions: {
            key: 'key',
            cert: 'cert',
            CAinter1: 'CAinter1',
            CAinter2: 'CAinter2',
            CAroot: 'CAroot'
          }
        }
      };
      var service = new TestService(options);
      var serverOptions = service._readHttpsOptions();
      serverOptions.key.should.equal('key');
      serverOptions.cert.should.equal('cert');
      serverOptions.ca[0].should.equal('CAinter1');
      serverOptions.ca[1].should.equal('CAinter2');
      serverOptions.ca[2].should.equal('CAroot');
    });
  });
  describe('#_startWalletService', function() {
    it('error from express', function(done) {
      function TestExpressApp() {}
      TestExpressApp.prototype.start = sinon.stub().callsArgWith(1, new Error('test'));
      function TestWSApp() {}
      TestWSApp.prototype.start = sinon.stub().callsArg(2);
      var listen = sinon.stub().callsArg(1);
      var TestService = proxyquire('../ltc-node', {
        '../lib/expressapp': TestExpressApp,
        '../lib/wsapp': TestWSApp,
        'http': {
          Server: sinon.stub().returns({
            listen: listen
          })
        }
      });
      var options = {
        node: {
          ltcwsPort: 3232
        }
      };
      var service = new TestService(options);
      var config = {};
      service._startWalletService(config, function(err) {
        err.message.should.equal('test');
        done();
      });
    });
    it('error from server.listen', function(done) {
      var app = {};
      function TestExpressApp() {
        this.app = app;
      }
      TestExpressApp.prototype.start = sinon.stub().callsArg(1);
      function TestWSApp() {}
      TestWSApp.prototype.start = sinon.stub().callsArg(2);
      var listen = sinon.stub().callsArgWith(1, new Error('test'));
      var TestService = proxyquire('../ltc-node', {
        '../lib/expressapp': TestExpressApp,
        '../lib/wsapp': TestWSApp,
        'http': {
          Server: function() {
            arguments[0].should.equal(app);
            return {
              listen: listen
            };
          }
        }
      });
      var options = {
        node: {
          ltcwsPort: 3232
        }
      };
      var service = new TestService(options);
      var config = {};
      service._startWalletService(config, function(err) {
        err.message.should.equal('test');
        done();
      });
    });
    it('will enable https', function(done) {
      var app = {};
      function TestExpressApp() {
        this.app = app;
      }
      TestExpressApp.prototype.start = sinon.stub().callsArg(1);
      function TestWSApp() {}
      TestWSApp.prototype.start = sinon.stub().callsArg(2);
      var listen = sinon.stub().callsArg(1);
      var httpsOptions = {};
      var createServer = function() {
        arguments[0].should.equal(httpsOptions);
        arguments[1].should.equal(app);
        return {
          listen: listen
        };
      };
      var TestService = proxyquire('../ltc-node', {
        '../lib/expressapp': TestExpressApp,
        '../lib/wsapp': TestWSApp,
        'https': {
          createServer: createServer
        }
      });
      var options = {
        node: {
          https: true,
          ltcwsPort: 3232
        }
      };
      var service = new TestService(options);
      service._readHttpsOptions = sinon.stub().returns(httpsOptions);
      var config = {};
      service._startWalletService(config, function(err) {
        service._readHttpsOptions.callCount.should.equal(1);
        listen.callCount.should.equal(1);
        done();
      });
    });
  });
  describe('#start', function(done) {
    it('error from blockchain monitor', function(done) {
      var app = {};
      function TestBlockchainMonitor() {}
      TestBlockchainMonitor.prototype.start = sinon.stub().callsArgWith(1, new Error('test'));
      function TestLocker() {}
      TestLocker.prototype.listen = sinon.stub();
      function TestEmailService() {}
      TestEmailService.prototype.start = sinon.stub();
      var TestService = proxyquire('../ltc-node', {
        '../lib/blockchainmonitor': TestBlockchainMonitor,
        '../lib/emailservice': TestEmailService,
        'socket.io': sinon.stub().returns({
          on: sinon.stub()
        }),
        'locker-server': TestLocker,
      });
      var options = {
        node: {}
      };
      var service = new TestService(options);
      var config = {};
      service._getConfiguration = sinon.stub().returns(config);
      service._startWalletService = sinon.stub().callsArg(1);
      service.start(function(err) {
        err.message.should.equal('test');
        done();
      });
    });
    it('error from email service', function(done) {
      var app = {};
      function TestBlockchainMonitor() {}
      TestBlockchainMonitor.prototype.start = sinon.stub().callsArg(1);
      function TestLocker() {}
      TestLocker.prototype.listen = sinon.stub();
      function TestEmailService() {}
      TestEmailService.prototype.start = sinon.stub().callsArgWith(1, new Error('test'));
      var TestService = proxyquire('../ltc-node', {
        '../lib/blockchainmonitor': TestBlockchainMonitor,
        '../lib/emailservice': TestEmailService,
        'socket.io': sinon.stub().returns({
          on: sinon.stub()
        }),
        'locker-server': TestLocker,
      });
      var options = {
        node: {}
      };
      var service = new TestService(options);
      service._getConfiguration = sinon.stub().returns({
        emailOpts: {}
      });
      service._startWalletService = sinon.stub().callsArg(1);
      service.start(function(err) {
        err.message.should.equal('test');
        done();
      });
    });
  });
});
