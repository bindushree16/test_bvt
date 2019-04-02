'use strict';

var self = testSetup;
module.exports = self;

var chai = require('chai');
var nconf = require('nconf');
var fs = require('fs');
var backoff = require('backoff');

var ShippableAdapter = require('./_common/shippable/Adapter.js');

global.util = require('util');
global._ = require('underscore');
global.async = require('async');
global.assert = chai.assert;
global.expect = require('chai').expect;

global.logger = require('./_common/logging/logger.js')(process.env.LOG_LEVEL);

global.config = {};
global.TIMEOUT_VALUE = 0;
global.DELETE_PROJ_DELAY = 5000;

global.config.apiUrl = process.env.SHIPPABLE_API_URL;

global.SHIPPABLE_API_TOKEN = process.env.SHIPPABLE_API_TOKEN;

global.GH_OWN_PROJECT_API_NAME = process.env.GH_OWN_PROJECT_API_NAME
global.GH_OWN_PROJECT_API_SOURCE_ID = process.env.GH_OWN_PROJECT_API_SOURCE_ID
global.GH_OWN_PROJECT_API_PROJECT_RENAME = process.env.GH_OWN_PROJECT_API_PROJECT_RENAME
// each test starts off as a new process, setup required constants
function testSetup(done) {
  var who = util.format('%s|%s', self.name, testSetup.name);
  logger.debug(who, 'Inside');

  global.suAdapter = new ShippableAdapter(process.env.SHIPPABLE_API_TOKEN);

  var bag = {
    systemCodes: null
  };

  // setup any more data needed for tests below
  async.parallel(
    [
      getSystemCodes.bind(null, bag)
    ],
    function (err) {
      if (err) {
        logger.error(who, 'Failed');
        return done(err);
      }
      global.systemCodes = bag.systemCodes;
      logger.debug(who, 'Completed');
      return done();
    }
  );
}

function getSystemCodes(bag, next) {
  var who = util.format('%s|%s', self.name, getSystemCodes.name);
  logger.debug(who, 'Inside');

  global.suAdapter.getSystemCodes('',
    function (err, systemCodes) {
      if (err) {
        logger.error(who, 'Failed');
        return next(err);
      }

      logger.debug(who, 'Completed');
      bag.systemCodes = systemCodes;
      return next();
    }
  );
}

global.newApiAdapterByToken = function (apiToken) {
  return new ShippableAdapter(apiToken);
};
