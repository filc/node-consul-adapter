'use strict';

var assert = require("assert");
var HexConnector = require('node-hexconnector');
var mockery = require('mockery');

var connector = new HexConnector();

var consulMock = function () {
    return {
        catalog: {
            service: {
                nodes: function(service, callback){
                    if (service === 'success') {
                        return callback(null, [{'Address': 'HOST', ServicePort: 200}]);
                    } else if (service === 'endPoints') {
                        return callback(null, [
                            {'Address': 'HOST-1', ServicePort: 200},
                            {'Address': 'HOST-2', ServicePort: 200},
                            {'Address': 'HOST-3', ServicePort: 200}
                        ]);
                    }
                    return callback('error_callback');
                }
            }
        }
    };
};

mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});

mockery.registerMock('consul', consulMock);

connector.registerAdapter('consul', __dirname + '/../', {config: {options: null}});

describe("Consul adapter", function() {

    after(function(){
        mockery.disable();
    });

    describe("Consul getEndpoints method", function() {

        it("should be resolved with an endpoint", function() {
            return connector.adapters.consul.getEndpoints('endPoints').then(function(response) {
                assert.deepEqual(response, ['HOST-1:200', 'HOST-2:200', 'HOST-3:200']);
            });
        });

        it("should be rejected", function() {
            return connector.adapters.consul.getEndpoints('failed').catch(function(err) {
                assert.equal(err, 'error_callback');
            });
        });
    });

    describe("Consul getAnEndpoint method", function() {

        it("should be resolved with an endpoint", function() {
            return connector.adapters.consul.getAnEndpoint('success').then(function(response) {
                assert.equal(response, 'HOST:200');
            });
        });

        it("should be rejected", function() {
            return connector.adapters.consul.getAnEndpoint('failed').catch(function(err) {
                assert.equal(err, 'error_callback');
            });
        });
    });
});