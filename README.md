# node-consul-adapter

This package is a service discovery adapter using consul services.

## Installation

npm install consul-adapter

## Usage example with hexconnector 1

```
const HexConnector = require('node-hexconnector');
const cn = new HexConnector();

const serviceDiscovery = require('consul-adapter');

const config = {
    options: {
        host: '127.0.0.1',
        port: 8500
    }
};

serviceDiscovery.initAdapter(cn, config);

cn.adapters.serviceDiscovery.getAnEndpoint('serviceName')
    .then((endpoint) => {
        console.log(endpoint);
    })
    .catch((error) => {
        console.log(error);
    });

```

## Usage example with hexconnector 2

```
const HexConnector = require('node-hexconnector');
const cn = new HexConnector();

const config = {
    options: {
        host: '127.0.0.1',
        port: 8500
    }
};

cn.registerAdapter('serviceDiscovery', 'consul-adapter', config);

cn.adapters.serviceDiscovery.getAnEndpoint('serviceName')
    .then((endpoint) => {
        console.log(endpoint);
    })
    .catch((error) => {
        console.log(error);
    });

```

