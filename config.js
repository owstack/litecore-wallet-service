var config = {
  basePath: '/ltcws/api',
  disableLogs: false,
  port: 3232,

  // Uncomment to make LTCWS a forking server
  // cluster: true,

  // Uncomment to set the number or process (will use the nr of availalbe CPUs by default)
  // clusterInstances: 4,

  // https: true,
  // privateKeyFile: 'private.pem',
  // certificateFile: 'cert.pem',
  ////// The following is only for certs which are not
  ////// trusted by nodejs 'https' by default
  ////// CAs like Verisign do not require this
  // CAinter1: '', // ex. 'COMODORSADomainValidationSecureServerCA.crt'
  // CAinter2: '', // ex. 'COMODORSAAddTrustCA.crt'
  // CAroot: '', // ex. 'AddTrustExternalCARoot.crt'

  storageOpts: {
    mongoDb: {
      uri: 'mongodb://localhost:27017/ltcws',
    },
  },
  lockOpts: {
    //  To use locker-server, uncomment this:
    lockerServer: {
      host: 'localhost',
      port: 3231,
    },
  },
  messageBrokerOpts: {
    //  To use message broker server, uncomment this:
    messageBrokerServer: {
      url: 'http://localhost:3380',
    },
  },
  blockchainExplorerOpts: {
    defaultProvider: 'explorer',
    explorer: {
      // Multiple servers (in priority order)
      // url: ['http://a.b.c', 'https://test-explorer.openwalletstack.com:443'],
      livenet: {
        url: 'http://ltc.owstack.org:3001',
        apiPrefix: '/explorer-api'
      },
      testnet: {
        url: 'https://test-insight.bitpay.com',
        apiPrefix: '/api'
      },
    },
  },
  pushNotificationsOpts: {
    templatePath: './lib/templates',
    defaultLanguage: 'en',
    defaultUnit: 'ltc',
    subjectPrefix: '',
    pushServerUrl: 'https://fcm.googleapis.com/fcm',
    authorizationKey: '',
  },
  fiatRateServiceOpts: {
    defaultProvider: 'Bitstamp',
    fetchInterval: 60, // in minutes
  },
  // To use email notifications uncomment this:
  // emailOpts: {
  //  host: 'localhost',
  //  port: 25,
  //  ignoreTLS: true,
  //  subjectPrefix: '[Wallet Service]',
  //  from: 'wallet-service@ltc.io',
  //  templatePath: './lib/templates',
  //  defaultLanguage: 'en',
  //  defaultUnit: 'ltc',
  //  publicTxUrlTemplate: {
  //    'livenet': 'https://explorer.openwalletstack.com/tx/{{txid}}',
  //    'testnet': 'https://test-explorer.openwalletstack.com/tx/{{txid}}',
  //  },
  //},
  //
  // To use sendgrid:
  // var sgTransport = require('nodemail-sendgrid-transport');
  // mailer:sgTransport({
  //  api_user: xxx,
  //  api_key: xxx,
  // });
};
module.exports = config;
