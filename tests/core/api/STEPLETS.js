'use strict';

var testSetup = require('../../../testSetup.js');
var backoff = require('backoff');

var testSuite = 'API_STEPLETS';
var testSuiteDesc = 'Github Organization Steplets API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var steplet = [];
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var pipeline = {};
    var pipelineSteps = {};
    var step = {};
    var run = {}

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

    it('2. User posts github integration to add pipelineSources',
      function (done) {
        var body = {
          "masterIntegrationId": 20,
          "masterIntegrationName": "github",
          "name": 'WWWroo',
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
    it('4. User posts pipeline to add PipelineSteps',
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

    it('5. User post PipelineSteps to add Runs',
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

    it('6. User post Runs to add steps',
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

    it('7. User post steps to add steplets',
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
          function (err, steplets) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add Steplet',
                    util.inspect(err))
                 )
               );
             steplet = steplets;
             return done();
          }
        );
      }
    );

    it('9. User can get their steplets by Id',
      function (done) {
        userApiAdapter.getStepletById(steplet.id,
          function (err, steplets) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get steplet by Id', err)
                )
              );
             steplet = steplets;
            assert.isNotEmpty(steplets, 'User cannot find the stepletId');
            return done();
          }
        );
      }
    );

    it('10. User can update the steplets by Id',
      function (done) {
        var body = {
           "statusCode": global.GH_STATUS_CODE
        };
        userApiAdapter.putStepletById(steplet.id, body,
          function (err, steplets) {
            if (err)
              return done(
              new Error(
                  util.format('User cannot update steplet',
                  util.inspect(err))
                 )
                );
            return done();
          }
        );
      }
    );

    it('11. User can get their steplets',
      function (done) {
        userApiAdapter.getSteplets('',
          function (err, steplets) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get steplet', err)
                )
               );
             steplet = _.first(steplets);
             assert.isNotEmpty(steplets, 'User cannot find the steplet');
             return done();
          }
        );
      }
    );

    it('12. stepletsId in steplets API shouldnot be null and should be a integer type',
     function (done) {
        assert.isNotNull(steplet.id, 'Id cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('13. stepletsProjectId in steplets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'ProjectId cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('14. stepletsStepId in steplets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'StepId cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('15. stepletsStepletNumber in steplets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'Steplet Number cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

   it('16. stepletsStatusCode in steplets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'StatusCode cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('17. stepletsStartedAt in stepLets API shouldnot be null and should be a integer type',
     function (done) {
        assert.isNotNull(steplet.id, 'StartedAt cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('18. stepletsEndedAt in stepLets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'EndedAt cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('19. stepletSQueuedAt in stepLets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'QueuedAt cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('20. stepletsCreatedAt in steplets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'CreatedAt cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('21. stepletsUpdatedAt in steplets API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(steplet.id, 'UpdatedAt cannot be null');
        assert.equal(typeof(steplet.id), 'number');
        return done();
      }
    );

    it('22. User can delete by Steplets By Pipeline Id',
      function (done) {
         userApiAdapter.deleteStepletsByPipelineId(pipeline.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('User cannot delete Runs by steplet Pipeline Id',
                     run.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('23. User can delete steplets by Id',
      function (done) {
        userApiAdapter.deleteStepletById(steplet.id,
        function (err, result) {
          if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot delete steplets by Id',
                    steplet.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('24. User can delete step by Id',
      function (done) {
        userApiAdapter.deleteStepById(step.id,
          function (err, result) {
            if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot delete step by Id',
                    steps.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('25. User can delete by runs By Pipeline Id',
      function (done) {
         userApiAdapter.deleteRunsByPipelineId(pipeline.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('User cannot delete Runs by pipeline Id',
                     run.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('26. User can deletes pipelineSteps by Id',
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

    it('27. User can delete pipelines by Id',
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

    it('28. User can delete pipelineSource by Id',
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

    it('29. User can deletes integration by Id',
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
