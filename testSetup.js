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
global.config.apiUrl = process.env.SHIPPABLE_API_URL;


global.GH_USR_API_PROJECT_NAME = process.env.GH_USR_API_PROJECT_NAME
global.GH_USR_API_PROJECT_SOURCE_ID = process.env.GH_USR_API_PROJECT_SOURCE_ID
global.GH_USR_API_PROJECT_RENAME = process.env.GH_USR_API_PROJECT_RENAME
global.GH_USR_API_INTEGRATION_NAME = process.env.GH_USR_API_INTEGRATION_NAME
global.GH_USR_API_RENAME_INTERGATION = process.env.GH_USR_API_RENAME_INTERGATION
global.GH_USR_API_PIPELINE_INTEGRATION_NAME = process.env.GH_USR_API_PIPELINE_INTEGRATION_NAME
global.GH_USR_API_PIPELINE_NAME = process.env.GH_USR_API_PIPELINE_NAME
global.GH_USR_API_PIPELINE_RENAME = process.env.GH_USR_API_PIPELINE_RENAME
global.GH_NAMEGIT = process.env.GH_NAMEGIT


global.SHIPPABLE_SUPERUSER_TOKEN = process.env.SHIPPABLE_SUPERUSER_TOKEN
global.SHIPPABLE_ADMIN_TOKEN = process.env.SHIPPABLE_ADMIN_TOKEN
global.SHIPPABLE_MEMBER_TOKEN = process.env.SHIPPABLE_MEMBER_TOKEN
global.GH_ACCESS_TOKEN = process.env.GH_ACCESS_TOKEN
global.GH_USERNAME = process.env.GH_USERNAME
global.GH_PROJECT_NAME = process.env.GH_PROJECT_NAME
global.GH_PROJECT_BRANCH = process.env.GH_PROJECT_BRANCH
global.GH_ADMIN_PROJECT_NAME = process.env.GH_ADMIN_PROJECT_NAME


global.GH_USR_API_PIPELINESOURCES_INTEGRATION_NAME= process.env.GH_USR_API_PIPELINESOURCES_INTEGRATION_NAME
global.GH_USR_API_PIPELINESTEPS_NAME= process.env.GH_USR_API_PIPELINESTEPS_NAME
global.GH_USR_API_PIPELINESTEPS_RENAME= process.env.GH_USR_API_PIPELINESTEPS_RENAME

global.GH_STEPLET_NUMBER=process.env.GH_STEPLET_NUMBER
global.GH_STATUS_CODE=process.env.GH_STATUS_CODE

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
