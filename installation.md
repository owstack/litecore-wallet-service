The following document is a step-by-step guide to run LTCWS.

### Prerequisites
Ensure MongoDB (2.6+) is installed and running. This document assumes that mongod is running at the default port 27017.
See the configuration section to configure a different host/port.

### Install LTCWS from NPM
Use the following steps to Install LTCWS from the npmjs repository and run it with defaults.
```bash
npm install ltc-wallet-service
cd ltc-wallet-service
```
To change configuration before running, see the Configuration section.
```bash
npm start
```

### Install LTCWS from github source
Use the following steps to Install LTCWS from github source and run it with defaults.
```bash
git clone https://github.com/owstack/ltc-wallet-service.git
cd ltc-wallet-service
npm install
```
To change configuration before running, see the Configuration section.
```bash
npm start
```
### Configuration
Configuration for all required modules can be specified in https://github.com/owstack/ltc-wallet-service/blob/master/config.js

LTCWS is composed of 5 separate node services -
Locker - locker/locker.js
Message Broker - messagebroker/messagebroker.js
Blockchain Monitor - bcmonitor/bcmonitor.js (This service talks to the Blockchain Explorer service configured under blockchainExplorerOpts - see Configure blockchain service below.)
Email Service - emailservice/emailservice.js
Ltc Wallet Service - ltcws.js

#### Configure MongoDB
Example configuration for connecting to the MongoDB instance:
```javascript
  storageOpts: {
    mongoDb: {
      uri: 'mongodb://localhost:27017/ltcws',
    },
  }
```
#### Configure Locker service
Example configuration for connecting to locker service:
```javascript
  lockOpts: {
    lockerServer: {
      host: 'localhost',
      port: 3231,
    },
  }
```

#### Configure Message Broker service
Example configuration for connecting to message broker service:
```javascript
  messageBrokerOpts: {
    messageBrokerServer: {
      url: 'http://localhost:3380',
    },
  }
```

#### Configure blockchain service
Note: this service will be used by blockchain monitor service as well as by LTCWS itself.
An example of this configuration is:
```javascript
  blockchainExplorerOpts: {
    defaultProvider: 'explorer',

    // Providers
    'explorer': {
      'livenet': {
        url: 'https://explorer.openwalletstack.com:443',
        apiPrefix: '/explorer-api'
      },
      'testnet': {
        url: 'https://test-explorer.openwalletstack.com:443',
        apiPrefix: '/explorer-api'
      }
    }
  }
```

#### Configure Email service
Example configuration for connecting to email service (using postfix):
```javascript
  emailOpts: {
    host: 'localhost',
    port: 25,
    ignoreTLS: true,
    subjectPrefix: '[Wallet Service]',
    from: 'wallet-service@openwalletstack.com',
  }
```

#### Enable clustering
Change `config.js` file to enable and configure clustering:
```javascript
{
  cluster: true,
  clusterInstances: 4,
}
```

