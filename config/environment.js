/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'urgnot',
    environment: environment,
    version: "0.0.1",

    contentSecurityPolicy: { 
      'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com",
      'frame-src': "'self' https://*.firebaseio.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
      'font-src': "'self' fonts.gstatic.com",
      'script-src': "'self' 'unsafe-eval' https://*.firebaseio.com localhost:49154 0.0.0.0:49154"
    },

    firebase: 'https://urgnot.firebaseio.com/',
    torii: {
      sessionServiceName: 'session',
    },
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    // fonts
    googleFonts: [
      'Open+Sans:300,400',
      'Roboto:300'
    ],

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
