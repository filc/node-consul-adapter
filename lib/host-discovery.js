var _ = require('lodash');
var request = require('request');
var network = require('network');

var hostDiscovery = {
    aws: function () {
        return new Promise(function (resolve, reject) {
            request.get('http://169.254.169.254/latest/meta-data/local-ipv4', {}, function (err, response, body) {
                if (err) {
                    return reject(err);
                }
                return resolve(body);
            });
        });
    },
    dockerContainerDefaultGateway: function () {
        return new Promise(function (resolve, reject) {
            network.get_gateway_ip(function (err, ip) {
                if (err) {
                    return reject(err);
                }
                return resolve(ip);
            });
        });
    }
};

module.exports = {
    discoverHost: function (config) {
        if (_.has(config, 'discoverHost') && _.has(hostDiscovery, config.discoverHost)) {
            return hostDiscovery[config.discoverHost]()
              .then(function (host) {
                  return _.set(config, 'options.host', host);
              });
        }
        return Promise.resolve(config);
    }
};
