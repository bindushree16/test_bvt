'use strict';
var testSetup = require('../../../testSetup.js');
var testSuite = 'API_STEPLETCONSOLES';
var testSuiteDesc = 'Github Organization Stepletconsoles API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var step = {};
    var steplets = {};
    var project = {};
    var integration = {};
    var pipelineSources = {};
    var pipeline = {};
    var pipelineSteps = {};
    var run = {};
    var stepletConsoles = {};

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

    it('2. User posts github integration to add stepletConsoles',
      function (done) {
        var body = {
         "masterIntegrationId": 20,
         "masterIntegrationName": "github",
         "name": global.GH_USR_API_PIPELINESOURCES_INTEGRATION_NAME,
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

    it('3. User can post their pipelineSources to add stepletConsoles',
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
                  util.format('User cannot add pipelineSources',
                    util.inspect(err))
                )
              );

             pipelineSources = pSource;
             return done();
          }
        );
      }
    );

    it('4. User post pipeline to add stepletConsoles',
      function (done) {
        var body = {
          "name": global.GH_USR_API_PIPELINE_NAME,
          "projectId": project.id,
          "pipelineSourceId": pipelineSources.id
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

    it('5. User post pipelineSteps to add stepletConsoles',
      function (done) {
        var body = {
          "name": global.GH_USR_API_PIPELINESTEPS_NAME,
          "affinityGroup": "test_group",
          "typeCode": 2007,
          "projectId": project.id,
          "pipelineSourceId": pipelineSources.id,
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

    it('6. User post runs to add stepletConsoles',
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

    it('7. user post steps to add stepletConsoles',
      function (done) {
        var body = {
          "projectId": project.id,
          "name" : "vedha",
          "pipelineId": pipeline.id,
          "pipelineStepId": pipelineSteps.id,
          "runId": run.id,
          "typeCode" : 2007,
          "statusCode": 4002
        };
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

    it('8. User can add new steplets',
      function (done) {
        var body = {
          "projectId": project.id,
          "pipelineId": pipeline.id,
          "stepId": step.id,
          "stepletNumber": global.GH_STEPLET_NUMBER,
          "statusCode": global.GH_STATUS_CODE
        };
        userApiAdapter.postSteplet(body,
          function (err, stepls) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add Steplet',
                    util.inspect(err))
                 )
               );
             steplets = stepls;
             return done();
          }
        );
      }
    );

    it('9. user can add new stepletConsoles',
      function (done) {
        var body = {
          "stepId": step.id,
          "stepletConsoles": [{
            "consoleId": "varun",
            "parentConsoleId": "root",
            "type": "grp",
            "message": "dummy group",
            "timestamp": 1554712261060,
            "timestampEndedAt": 1554712262060,
            "isSuccess": true,
            "isShown": true
           }]
         }
        userApiAdapter.postStepletConsoles(body,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add stepletConsoles',
                    util.inspect(err))
                )
              );
            stepletConsoles = result;
            return done();
          }
        );
      }
    );

    it('10. user can get their stepletConsoles',
      function (done) {
        userApiAdapter.getStepletConsolesByStepletsId(steplets.id,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get stepletConsoles',
                    result, err)
                )
              );
            stepletConsoles = _.first(result.root);
            assert.isNotEmpty(result, 'User cannot find the stepletConsoles');
            return done();
          }
        );
      }
    );

    it('11. StepletconsolesConsoleId field in stepletConsoles API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletConsoles.consoleId, 'StepletConsoles name cannot be null');
        assert.equal(typeof(stepletConsoles.consoleId), 'string');
        return done();
      }
    );

    it('12. StepletconsolesIsShown field in stepletConsoles API should be a boolean type',
      function (done) {
        assert.equal(typeof(stepletConsoles.isShown), 'boolean');
        return done();
      }
    );

    // it('13. StepletconsolesIsSuccess field in stepletConsoles API should be a boolean type',
    //   function (done) {
    //     assert.equal(typeof(stepletConsoles.isSuccess), 'boolean');
    //     return done();
    //   }
    // ); commenting since type is undefined as of now. Will uncomment once it is fixed

    it('14. StepletconsolesParentConsoleId field in stepletConsoles API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletConsoles.parentConsoleId, 'StepletConsoles parent console id cannot be null');
        assert.equal(typeof(stepletConsoles.parentConsoleId), 'string');
        return done();
      }
    );

    // it('15. StepletconsolesStepletId field in stepletConsoles API shouldnot be null and should be a integer type',
    //   function (done) {
    //     assert.isNotNull(stepletConsoles.stepletId, 'StepletConsoles steplet id cannot be null');
    //     assert.equal(typeof(stepletConsoles.stepletId), 'number');
    //     return done();
    //   }
    // );

    it('16. StepletconsolesTimestamp field in stepletConsoles API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(stepletConsoles.timestamp, 'StepletConsoles timestamp cannot be null');
        assert.equal(typeof(stepletConsoles.timestamp), 'number');
        return done();
      }
    );

    // it('17. StepletconsolesTimestampEndedAt field in stepletConsoles API should be a integer type',
    //   function (done) {
    //     assert.equal(typeof(stepletConsoles.timestampEndedAt), 'number');
    //     return done();
    //   }
    // );

    it('18. StepletconsolesType field in stepletConsoles API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletConsoles.type, 'StepletConsoles type cannot be null');
        assert.equal(typeof(stepletConsoles.type), 'string');
        return done();
      }
    );

    it('19. StepletconsolesMessage field in stepletConsoles API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletConsoles.message, 'StepletConsoles message cannot be null');
        assert.equal(typeof(stepletConsoles.message), 'string');
        return done();
      }
    );

    it('20. StepletconsolesCreatedAt field in stepletConsoles API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletConsoles.createdAt, 'StepletConsoles created at cannot be null');
        assert.equal(typeof(stepletConsoles.createdAt), 'string');
        return done();
      }
    );

  // it('21. StepletconsolesUpdatedAt field in stepletConsoles API shouldnot be null and should be a string type',
  //   function (done) {
  //     assert.isNotNull(stepletConsoles.updatedAt, 'StepletConsoles updated at cannot be null');
  //     assert.equal(typeof(stepletConsoles.updatedAt), 'string');
  //     return done();
  //   }
  // );   

    it('22. user can delete stepletConsoles by pipelineId',
      function (done) {
        userApiAdapter.deleteStepletConsolesByPipelineId(pipeline.id,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot delete stepletConsoles by pipelineId',
                    pipeline.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('23. user can delete step by Id for stepletConsoles',
      function (done) {
        userApiAdapter.deleteStepById(step.id,
          function (err, result) {
            if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot delete step by Id',
                    steplets.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('24.  User can delete by runs for stepletConsoles',
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

    it('25. User can deletes pipelineSteps by Id for stepletConsoles',
      function (done) {
        userApiAdapter.deletePipelineStepsById(pipelineSteps.id,
          function (err, psteps) {
            if (err || _.isEmpty(psteps))
              return done(
                new Error(
                  util.format('User cannot delete pipelineSteps by Id',
                    pipelineSteps.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('26.  User can delete pipelines by Id for stepletConsoles',
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

    it('27. User can delete pipelineSource by Id for stepletConsoles',
      function (done) {
        userApiAdapter.deletePipelineSourcesById(pipelineSources.id,
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

    it('28. User can deletes integration by Id for stepletConsoles',
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
