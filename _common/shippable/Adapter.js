'use strict';

var self = ShippableAdapter;
module.exports = self;
var request = require('request');

function ShippableAdapter(token) {
  logger.debug(util.format('Initializing %s', self.name));
  this.token = token;
  this.baseUrl = config.apiUrl;
  this.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'apiToken '.concat(token)
  };
}

// #######################   GET  by alphabetical order  #####################
/*
 ------------------------
 Standards:
 ------------------------
 * The parameters for this.method() in getSById should occupy
 a line of their own.

 * We're no longer using `var url`

 * `util.format` needs to be used for all routes that use an Id.

 ------------------------
 Formats:
 ------------------------

 ShippableAdapter.prototype.getSById =
 function (sId, callback) {
 this.get(
 util.format('/S/%s', sId),
 callback
 );
 };

 ShippableAdapter.prototype.getS =
 function (callback) {
 this.get('/S', callback);
 };

 ShippableAdapter.prototype.getSByParentId =
 function (parentId, callback) {
 this.get(
 util.format('/parent/%s/S', parentId),
 callback
 );
 };

 */

ShippableAdapter.prototype.postAuth = function (sysIntId, json, callback) {
  var url = util.format('/accounts/auth/%s', sysIntId);
  this.post(url, json, callback);
};

ShippableAdapter.prototype.getIntegrations =
  function (query, callback) {
    this.get(
      util.format('/integrations?%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getIntegrationById =
  function (id, callback) {
    this.get(
      util.format('/integrations/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.getPipelines =
  function (query, callback) {
    this.get(
      util.format('/pipelines?%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getPipelineById =
  function (id, callback) {
    this.get(
      util.format('/pipelines/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.getPipelineSources =
  function (query, callback) {
    this.get(
      util.format('/pipelineSources?%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getPipelineSourceById =
  function (id, callback) {
    this.get(
      util.format('/pipelineSources/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.getProjects =
  function (query, callback) {
    this.get(
      util.format('/projects?%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getProjectById =
  function (id, callback) {
    this.get(
      util.format('/projects/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.getResources =
  function (query, callback) {
    this.get(
      '/resources?' + query,
      callback
    );
  };

ShippableAdapter.prototype.getResourceById =
  function (id, callback) {
    this.get(
      util.format('/resources/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.getResourceVersions =
  function (query, callback) {
    this.get(
      util.format('/resourceVersions/%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getResourceVersionById =
  function (id, callback) {
    this.get(
      util.format('/resourceVersions/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.getSystemCodes =
  function (query, callback) {
    this.get(
      '/systemCodes?' + query,
      callback
    );
  };

// #######################  POST  by alphabetical order  ######################

ShippableAdapter.prototype.postIntegration =
  function (json, callback) {
    this.post(
      '/integrations',
       json,
       callback
    );
  };

ShippableAdapter.prototype.postPipeline =
  function (json, callback) {
    this.post(
      '/pipelines',
      json,
      callback
    );
  };

ShippableAdapter.prototype.postPipelineSources =
  function (json, callback) {
    this.post(
      '/pipelineSources',
      json,
      callback
    );
  };

ShippableAdapter.prototype.postProject =
  function (json, callback) {
    this.post(
      '/projects',
      json,
      callback
    );
  };

ShippableAdapter.prototype.postResource =
  function (json, callback) {
    this.post(
      '/resources',
      json,
      callback
    );
  };

ShippableAdapter.prototype.postResourceVersion =
  function (json, callback) {
    this.post(
      '/resourceVersions',
      json,
      callback
    );
  };

// #######################  DELETE  by alphabetical order  ###################

ShippableAdapter.prototype.deleteIntegrationById =
  function (id, callback) {
    this.delete(
      util.format('/integrations/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.deletePipelineById =
  function (id, callback) {
    this.delete(
      util.format('/pipelines/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.deletePipelineSourcesById =
  function (id, callback) {
    this.delete(
      util.format('/pipelineSources/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.deleteResourceById =
 function (id, callback) {
   this.delete(
     util.format('/resources/%s', id),
     callback
     );
   };

ShippableAdapter.prototype.deleteResourceVersionById =
  function (id, callback) {
    this.delete(
      util.format('/resourceVersions/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.deleteResourceVersionByResourceId =
  function (id, callback) {
    this.delete(
      util.format('/resourceVersions/%s', id),
      callback
    );
  };

// #######################  PUT  by alphabetical order  ########################

ShippableAdapter.prototype.putIntegrationById =
  function (id, json, callback) {
    this.put(
      util.format('/integrations/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.putPipelineById =
  function (id, json, callback) {
    this.put(
      util.format('/pipelines/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.putPipelineSourcesById =
  function (id, json, callback) {
    this.put(
      util.format('/pipelineSources/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.putProjectById =
  function (id, json, callback) {
    this.put(
      util.format('/projects/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.putResourceById =
  function (id, json, callback) {
    this.put(
      util.format('/resources/%s', id),
      json,
      callback
     );
   };

ShippableAdapter.prototype.deleteResourceById =
 function (id, callback) {
   this.delete(
     util.format('/resources/%s', id),
     callback
     );
   };

ShippableAdapter.prototype.getRuns =
 function (query, callback) {
   this.get(
     util.format('/runs?%s', query),
     callback
   );
 };

ShippableAdapter.prototype.getRunById =
 function (id, callback) {
   this.get(
     util.format('/runs/%s', id),
     callback
   );
 };

ShippableAdapter.prototype.postRuns =
 function (json, callback) {
   this.post(
     '/runs',
     json,
     callback
   );
 };

ShippableAdapter.prototype.putRunsById =
 function (id, json, callback) {
   this.put(
     util.format('/runs/%s', id),
     json,
     callback
   );
 };


ShippableAdapter.prototype.deleteRunsByPipelineId =
 function (id, callback) {
   this.delete(
     util.format('/pipelines/%s/runs', id),
     callback
   );
 };

ShippableAdapter.prototype.postPipelineSteps =
  function (json, callback) {
    this.post(
      '/pipelineSteps',
      json,
      callback
    );
  };

ShippableAdapter.prototype.getPipelineSteps =
  function (query, callback) {
    this.get(
      util.format('/pipelineSteps?%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getPipelineStepsById =
  function (id, callback) {
    this.get(
      util.format('/pipelineSteps/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.putPipelineStepsById =
  function (id, json, callback) {
    this.put(
      util.format('/pipelineSteps/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.deletePipelineStepsById =
  function (id, callback) {
    this.get(
      util.format('/pipelineSteps/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.postSteps =
  function (json, callback) {
    this.post(
      '/steps',
      json,
      callback
    );
  };

ShippableAdapter.prototype.putStepById =
  function (id, json, callback) {
    this.put(
      util.format('/steps/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.getSteps =
  function (query, callback) {
    this.get(
      '/steps?' + query,
      callback
    );
  };

ShippableAdapter.prototype.getStepsById =
  function (id, callback) {
    this.get(
      util.format('/steps/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.deleteStepById =
  function (id, callback) {
    this.delete(
      util.format('/steps/%s', id),
      callback
    );
  };

ShippableAdapter.prototype.deleteStepsByPipelineId =
  function (id, callback) {
    this.delete(
      util.format('/pipelines/%s/steps', id),
      callback
    );
  };

ShippableAdapter.prototype.postSteplet =
function (json, callback) {
  this.post(
    '/steplets',
    json,
    callback
  );
};

ShippableAdapter.prototype.putStepletById =
  function (id, json, callback) {
    this.put(
      util.format('/steplets/%s', id),
      json,
      callback
    );
  };

ShippableAdapter.prototype.deleteStepletById =
  function (StepLetId, callback) {
    this.delete(
      util.format('/steplets/%s', StepLetId),
      callback
    );
  };

ShippableAdapter.prototype.deleteStepletsByPipelineId =
 function (id, callback) {
   this.delete(
     util.format('/pipelines/%s/Steplets', id),
     callback
   );
 };

ShippableAdapter.prototype.getSteplets =
  function (query, callback) {
    this.get(
      util.format('/steplets?%s', query),
      callback
    );
  };

ShippableAdapter.prototype.getStepletById =
  function (id, callback) {
    this.get(
      util.format('/steplets/%s', id),
      callback
    );
  };

  ShippableAdapter.prototype.getSByStepsId =
    function (id, callback) {
      this.get(
        util.format('/steps/%s/consoles', id),
        callback
      );
    };

ShippableAdapter.prototype.deleteStepConsolesByPipelineId =
  function (id, callback) {
    this.delete(
      util.format('/pipelines/%s/stepConsoles', id),
      callback
    );
  };

ShippableAdapter.prototype.postStepConsoles =
  function (json, callback) {
    this.post(
      '/stepConsoles',
      json,
      callback
    );
  };


ShippableAdapter.prototype.get =
  function (relativeUrl, callback) {
    var bag = {};
    bag.opts = {
      method: 'GET',
      url: this.baseUrl.concat(relativeUrl),
      headers: this.headers
    };
    bag.who = util.format('%s call to %s', bag.opts.method, bag.opts.url);
    logger.debug(util.format('Starting %s', bag.who));

    async.series([
      _performCall.bind(null, bag),
      _parseBody.bind(null, bag)
    ],
      function () {
        callback(bag.err, bag.parsedBody, bag.res);
      }
    );
  };

ShippableAdapter.prototype.post =
  function (relativeUrl, json, callback) {
    var bag = {};
    bag.opts = {
      method: 'POST',
      url: this.baseUrl.concat(relativeUrl),
      headers: this.headers,
      json: json
    };
    bag.who = util.format('%s call to %s', bag.opts.method, bag.opts.url);
    logger.debug(util.format('Starting %s', bag.who));

    async.series([
      _performCall.bind(null, bag),
      _parseBody.bind(null, bag)
    ],
      function () {
        callback(bag.err, bag.parsedBody, bag.res);
      }
    );
  };

ShippableAdapter.prototype.put =
  function (relativeUrl, json, callback) {
    var bag = {};
    bag.opts = {
      method: 'PUT',
      url: this.baseUrl.concat(relativeUrl),
      headers: this.headers,
      json: json
    };
    bag.who = util.format('%s call to %s', bag.opts.method, bag.opts.url);
    logger.debug(util.format('Starting %s', bag.who));

    async.series([
      _performCall.bind(null, bag),
      _parseBody.bind(null, bag)
    ],
      function () {
        callback(bag.err, bag.parsedBody, bag.res);
      }
    );
  };

ShippableAdapter.prototype.delete =
  function (relativeUrl, callback) {
    var bag = {};
    bag.opts = {
      method: 'DELETE',
      url: this.baseUrl.concat(relativeUrl),
      headers: this.headers
    };
    bag.who = util.format('%s call to %s', bag.opts.method, bag.opts.url);
    logger.debug(util.format('Starting %s', bag.who));

    async.series([
      _performCall.bind(null, bag),
      _parseBody.bind(null, bag)
    ],
      function () {
        callback(bag.err, bag.parsedBody, bag.res);
      }
    );
  };

function _performCall(bag, next) {
  var who = bag.who + '|' + _performCall.name;
  logger.debug(who, 'Inside');
  bag.startedAt = Date.now();
  bag.timeoutLength = 1;
  bag.timeoutLimit = 180;

  __attempt(bag, next);

  function __attempt(bag, callback) {
    request(bag.opts,
      function (err, res, body) {
        var interval = Date.now() - bag.startedAt;
        var connectionError = false;
        if (res)
          logger.debug(
            util.format('%s took %s & returned status %s', bag.who, interval,
              res.statusCode)
          );
        else
          connectionError = true;
        if (res && res.statusCode > 299)
          err = err || res.statusCode;

        if ((res && res.statusCode > 299) || err)
          if ((res && res.statusCode >= 500) || connectionError ||
            res.statusCode === 408) {
            logger.error(
              util.format('%s returned error %s, body: %s, req body: %s. ' +
                ' Retrying in %s seconds', bag.who, res.statusCode,
                util.inspect(body), util.inspect(bag.opts.json),
                bag.timeoutLength * 2)
            );
            bag.timeoutLength *= 2;
            if (bag.timeoutLength > bag.timeoutLimit)
              bag.timeoutLength = 1;

            setTimeout(
              function () {
                __attempt(bag, callback);
              }, bag.timeoutLength * 1000);

            return;
          }
        logger.debug(util.format('%s returned status %s with error %s',
          bag.who, res && res.statusCode, err));
        bag.err = err;


        bag.res = res;
        bag.body = body;
        callback();
      }
    );
  }
}

function _parseBody(bag, next) {
  var who = bag.who + '|' + _parseBody.name;
  logger.debug(who, 'Inside');

  if (bag.body)
    if (typeof bag.body === 'object') {
      bag.parsedBody = bag.body;
    } else {
      try {
        bag.parsedBody = JSON.parse(bag.body);
      } catch (e) {
        logger.error('Unable to parse bag.body', bag.body, e);
        bag.err = e;
      }
    }

  return next();
}
