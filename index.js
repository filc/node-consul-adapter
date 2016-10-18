var _ = require('lodash');
var hostDiscovery = require('./lib/host-discovery');

var consul;

module.exports = {
    initAdapter: function (_connector, _config) {
        hostDiscovery.discoverHost(_config)
          .then(function (config) {
            consul = require('consul')(config.options);
          });
    },

    getAnEndpoint: function (service) {
        return new Promise(function (resolve, reject) {
            consul.catalog.service.nodes(service, function(err, result) {
                if (err) {
                    return reject(err);
                }

                _services = _.shuffle(result);
                resolve(_services[0].Address + ':' + _services[0].ServicePort.toString());
            });
        });
    }
};