'use strict';

var assert = require('assert');
var hostDiscovery = require('../lib/host-discovery');
var mockery = require('mockery');
var request = require('request');
var network = require('network');
var sinon = require('sinon');
var _ = require('lodash');

describe('Test setting consul.options.host configuration by host-discovery', function() {

  it('should bypass actions if config does not have "discoverHost" key', function(done) {
    var config = {};
    hostDiscovery.discoverHost(config)
      .then(function(configOut) {
        assert.equal(configOut, config);
        done();
      });
  });

  it('should bypass actions if config has "discoverHost" key, but invalid value', function(done) {
    var config = {discoverHost: 'somethingFake'};
    hostDiscovery.discoverHost(config)
      .then(function(configOut) {
        assert.equal(configOut, config);
        done();
      });
  });

  describe('Test aws dockerHost instance ip discovery', function () {

    afterEach(function () {
      request.get.restore();
    });

    it('should set config.options.host', function(done) {
      var config = {discoverHost: 'aws'};
      var configResult = _.assign({}, config, {
        options: {
          host: '127.0.0.1'
        }
      });

      sinon.stub(request, 'get')
        .yields(null,  null, '127.0.0.1');

      hostDiscovery.discoverHost(config)
        .then(function (configOut) {
          assert.equal(request.get.called, true);
          assert.deepEqual(configOut, configResult);
          done();
        });
    });

    it('should reject if request fails', function(done) {
      var config = {discoverHost: 'aws'};
      var errorMessage = 'Some error message';

      sinon.stub(request, 'get')
        .yields(errorMessage,  null, null);

      hostDiscovery.discoverHost(config)
        .catch(function (err) {
          assert.equal(request.get.called, true);
          assert.equal(err, errorMessage);
          done();
        });
    });
  });

  describe('Test docker bridged network default container gateway ip discovery', function () {

    afterEach(function () {
      network.get_gateway_ip.restore();
    });

    it('should set config.options.host', function(done) {
      var config = {discoverHost: 'dockerContainerDefaultGateway'};
      var configResult = _.assign({}, config, {
        options: {
          host: '127.0.0.1'
        }
      });

      sinon.stub(network, 'get_gateway_ip')
        .yields(null, '127.0.0.1');

      hostDiscovery.discoverHost(config)
        .then(function (configOut) {
          assert.equal(network.get_gateway_ip.called, true);
          assert.deepEqual(configOut, configResult);
          done();
        });
    });

    it('should reject if network lookup fails', function(done) {
      var config = {discoverHost: 'dockerContainerDefaultGateway'};
      var errorMessage = 'Some error message';

      sinon.stub(network, 'get_gateway_ip')
        .yields(errorMessage,  null);

      hostDiscovery.discoverHost(config)
        .catch(function (err) {
          assert.equal(network.get_gateway_ip.called, true);
          assert.equal(err, errorMessage);
          done();
        });
    });
  });

});

