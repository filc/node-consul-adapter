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

    getEndpoints: function (service) {
        return new Promise(function (resolve, reject) {
            consul.catalog.service.nodes(service, function(err, result) {
                if (err) {
                    return reject(err);
                }

                var endpoints = _.map(result, function (serviceNode) {
                    return serviceNode.Address + ':' + serviceNode.ServicePort.toString();
                });
                resolve(endpoints);
            });
        });
    },

    getAnEndpoint: function (service) {
        return this.getEndpoints(service)
          .then(function(endPoints) {
              return _.sample(endPoints);
          });

        // return new Promise(function (resolve, reject) {
        //     consul.catalog.service.nodes(service, function(err, result) {
        //         if (err) {
        //             return reject(err);
        //         }
        //
        //         var _services = _.shuffle(result);
        //         resolve(_services[0].Address + ':' + _services[0].ServicePort.toString());
        //     });
        // });
    }
};