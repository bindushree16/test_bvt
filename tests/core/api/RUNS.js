'use strict';

var testSetup = require('../../../testSetup.js');
var backoff = require('backoff');

var testSuite = 'API_RUNS';
var testSuiteDesc = 'Github Organization Runs API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var run = [];
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var resource = {};
    var pipeline = {}

    this.timeout(0);
    before(
      function (done) {
        async.series(
          [
            testSetup.bind(null)
          ],
          function (err) {
            if (err) {
              logger.error(test, 'Failed to setup tests. err:', err);
              return done(err);
            }

            userApiAdapter =
              global.newApiAdapterByToken(global.SHIPPABLE_API_TOKEN);
            return done();
          }
        );
      }
    );

    it('1. User gets projects to add pipelineSources',
      function getProject(done) {
        userApiAdapter.getProjects('',
          function(err, prjs) {
            if (err || _.isEmpty(prjs))
                return done(
                  new Error(
                    util.format('Project list is empty', err)
                  )
                );
            project = _.first(prjs);
            return done();
          }
        );
      }
    );

    it('2. User posts github integration to add pipelineSources',
      function (done) {
        var body = {
          "masterIntegrationId": 20,
          "masterIntegrationName": "github",
          "name": 'github8934598',
          "projectId": project.id,
          "formJSONValues": [
              {
                  "label": "url",
                  "value": "https://api.github.com"
              },
              {
                  "label": "token",
                  "value": global.GH_ACCESS_TOKEN
              }
            ]
          };
         userApiAdapter.postIntegration(body,
           function (err, int) {
             if (err)
               return done(
                 new Error(
                   util.format('User cannot add integration',
                    util.inspect(err))
                )
              );
              integration = int;
            return done();
          }
        );
     }
    );

    it('3. User posts PipelineSources to add pipelines',
     function (done) {
       var body = {
         "projectId": project.id,
         "repositoryFullName": global.GH_USERNAME + '/' +
           global.GH_PROJECT_NAME,
         "branch": global.GH_PROJECT_BRANCH,
         "integrationId": integration.id
       };
       userApiAdapter.postPipelineSources(body,
         function (err, pSource) {
           if (err)
             return done(
               new Error(
                 util.format('User cannot add PipelineSource',
                    util.inspect(err))
                )
              );
            pipelineSource = pSource;
            return done();
          }
        );
      }
    );

    it('4. User can add new pipeline',
      function (done) {
        var body = {
          "name": global.GH_USR_API_PIPELINE_NAME,
          "projectId": project.id,
          "pipelineSourceId": pipelineSource.id
        };
        userApiAdapter.postPipeline(body,
          function (err, pipe) {
             if (err)
               return done(
                 new Error(
                   util.format('User cannot add pipeline',
                     util.inspect(err))
                 )
               );
             pipeline = pipe;
             return done();
           }
        );
      }
    );

    it('1. User add new Runs',
      function (done) {
        var body = {
          "pipelineId": pipeline.id,
          "projectId": project.id,
          "statusCode":1000
        };
        userApiAdapter.postRuns(body,
          function (err, rSource) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add Run',
                    util.inspect(err))
                )
              );
            run = rSource;
            return done();
          }
        );
      }
    );

    it('2. User can get their Runs by Id',
      function (done) {
        userApiAdapter.getRunById(run.id,
          function (err, rSourceId) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get Run by Id', err)
                )
              );
            run = rSourceId;
            assert.isNotEmpty(rSourceId, 'User cannot find the Run Id');
            return done();
          }
        );
      }
    );

    it('3. User can update the Run by Id',
      function (done) {
        var body = {
             "statusCode":1004
        };
        userApiAdapter.putRunsById(run.id, body,
          function (err, rSourceId) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update Run',
                    util.inspect(err))
                  )
                );
            return done();
          }
        );
      }
    );

    it('4. User can get their Runs',
      function (done) {
        userApiAdapter.getRuns('',
          function (err, runs) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get Run', err)
                )
              );
            run = _.first(runs);
          assert.isNotEmpty(run, 'User cannot find the Run');
          return done();
          }
        );
      }
    );

    it('5. Id field in run API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(run.id, 'Id cannot be null');
        assert.equal(typeof(run.id), 'number');
        return done();
      }
    );

    it('6. PipelineId field in run API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(run.pipelineId, 'Pipeline Id cannot be null');
        assert.equal(typeof(run.pipelineId), 'number');
        return done();
      }
    );


    it('7. ProjectId field in run API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(run.projectId, 'Project Id cannot be null');
        assert.equal(typeof(run.projectId), 'number');
        return done();
      }
    );

    it('8.  User can delete run by pipelineId',
      function (done) {
         userApiAdapter.deleteRunsByPipelineId(pipeline.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('User cannot delete Runs by pipelineId',
                     run.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('9.  User can delete pipelines by Id',
      function (done) {
         userApiAdapter.deletePipelineById(pipeline.id,
            function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete Pipelines by Id',
                     pipeline.id, err)
                 )
                );
             return done();
           }
         );
       }
    );

    it('10. User can delete pipelineSource by Id',
      function (done) {
         userApiAdapter.deletePipelineSourcesById(pipelineSource.id,
           function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete PipelineSources by Id',
                     pipelineSource.id, err)
                 )
                );
             return done();
           }
         );
       }
    );

    it('11. User can deletes integration by Id',
      function (done) {
        userApiAdapter.deleteIntegrationById(integration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('User cannot delete integration by Id',
                    integration.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    after(
        function (done) {
          return done();
        }
      );
  }
);
