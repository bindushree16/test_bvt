'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_STEPSCONSOLES';
var testSuiteDesc = 'Github Organization steps API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var step = {};
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var pipeline = {};
    var pipelineSteps = {};
    var run = {};
    var stepConsoles = {}

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
    it('1. User can get their projects',
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

    it('2. User posts github integration to add stepConsoles',
      function (done) {
        var body = {
          "masterIntegrationId": 20,
          "masterIntegrationName": "github",
          "name": 'w16',
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

    it('3. User posts pipelinesource to add stepConsoles',
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

    it('4. User can add new pipeline ',
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

    it('5. User can add new PipelineSteps',
      function (done) {
        var body = {
          "name": global.GH_USR_API_PIPELINESTEPS_NAME,
          "affinityGroup": "test_group",
          "typeCode": 2007,
          "projectId": project.id,
          "pipelineSourceId": pipelineSource.id,
          "pipelineId": pipeline.id,
          "yml": {
              "name": "in_trigger_step",
              "type": "runSh"
          }
        };
        userApiAdapter.postPipelineSteps(body,
          function (err, psteps) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add PipelineSteps',
                    util.inspect(err))
                )
              );
              pipelineSteps = psteps;
            return done();
          }
        );
      }
    );

    it('6. User add new Runs',
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

    it('7. user can add new steps',
      function (done) {
        var body = {
          "projectId": project.id,
          "name" : "vijay",
          "pipelineId": pipeline.id,
          "pipelineStepId": pipelineSteps.id,
          "runId": run.id,
          "typeCode" : 2007,
          "statusCode": 4002
        }
        userApiAdapter.postSteps(body,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add steps',
                    util.inspect(err))
                )
              );
            step = result;
            return done();
          }
        );
      }
    );

    it('8. user can add new stepConsoles',
      function (done) {
        var body = {
          "stepId": step.id,
          "stepConsoles": [{
            "consoleId": "vijay",
            "parentConsoleId": "root",
            "type": "grp",
            "message": "dummy group",
            "timestamp": 1554712261060,
            "timestampEndedAt": 1554712262060,
            "isSuccess": true,
            "isShown": true
           }]
         }
        userApiAdapter.postStepConsoles(body,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add stepConsoles',
                    util.inspect(err))
                )
              );
            stepConsoles = result;
            return done();
          }
        );
      }
    );

    it('9. user can get their stepConsoles',
      function (done) {
        userApiAdapter.getSByStepsId(step.id,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get stepConsoles',
                    query, err)
                )
              );
             stepConsoles = _.first(result.root);
            assert.isNotEmpty(result, 'User cannot find the stepConsoles');
            return done();
          }
        );
      }
    );

    it('10. consoleId field in stepConsoles API' +
      'shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(stepConsoles.consoleId,
          'consoleId id field cannot be null');
        assert.equal(typeof(stepConsoles.consoleId), 'string');
        return done();
      }
    );

    it('11. isShown field in stepConsoles API should be a boolean',
      function (done) {
        assert.equal(typeof(stepConsoles.isShown), 'boolean');
        return done();
      }
    );

    it('12. isSuccess field in stepConsoles API should be a boolean',
      function (done) {
        assert.equal(typeof(stepConsoles.isSuccess), 'boolean');
        return done();
      }
    );

    it('13. parentConsoleId field in stepConsoles API' +
      'shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(stepConsoles.parentConsoleId,
          'parentConsoleId id field cannot be null');
        assert.equal(typeof(stepConsoles.parentConsoleId), 'string');
        return done();
      }
    );

    it('14. StepId field in stepConsoles API' +
      'shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(stepConsoles.stepId,
          'StepId field cannot be null');
        assert.equal(typeof(stepConsoles.stepId), 'number');
        return done();
      }
    );

    it('15. timestamp field in stepConsoles API' +
      'shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(stepConsoles.timestamp,
          'stepConsoles timestamp field by cannot be null');
        assert.equal(typeof(stepConsoles.timestamp), 'number');
        return done();
      }
    );

    it('16. timestampEndedAt field in stepConsoles API should be a integer',
      function (done) {
        assert.equal(typeof(stepConsoles.timestampEndedAt), 'number');
        return done();
      }
    );

    it('17. type field in stepConsoles API' +
      'shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(stepConsoles.type,
          'stepConsoles type field cannot be null');
        assert.equal(typeof(stepConsoles.type), 'string');
        return done();
      }
    );

    it('18. message field in stepConsoles API' +
      'shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(stepConsoles.message,
          'stepConsoles message field cannot be null');
        assert.equal(typeof(stepConsoles.message), 'string');
        return done();
      }
    );

    it('19.CreatedAt field in stepConsole' +
    'API shouldnot be null and should be a date',
      function (done) {
        assert.isNotNull(stepConsoles.createdAt,
          'stepConsoles createdAt field cannot be null');
        assert.equal(typeof(stepConsoles.createdAt), 'string');
        return done();
      }
    );

    it('20.UpatedAt field in stepConsole' +
    'API shouldnot be null and should be a date',
      function (done) {
        assert.isNotNull(stepConsoles.updatedAt,
          'stepConsoles updatedAt field cannot be null');
        assert.equal(typeof(stepConsoles.updatedAt), 'string');
        return done();
      }
    );

    it('21. user can delete stepConsoles by pipelineId',
      function (done) {
        userApiAdapter.deleteStepConsolesByPipelineId(pipeline.id,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot delete stepConsoles by pipelineId',
                    pipeline.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('22. User can delete pipelineSource by Id',
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

    it('23. User can deletes integration by Id',
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
