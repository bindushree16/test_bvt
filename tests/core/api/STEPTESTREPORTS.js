'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_STEPTESTREPORTS';
var testSuiteDesc = 'Github Organization StepTestReports API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var steplets = {};
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var pipeline = {};
    var pipelineSteps = {};
    var step = {};
    var run = {};
    var stepTestReports = {};

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

    it('2. User posts github integration to add stepTestReports',
      function (done) {
        var body = {
          "masterIntegrationId": 20,
          "masterIntegrationName": "github",
          "name": global.GH_USR_API_INTEGRATION_NAME,
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

    it('3. User posts PipelineSources to add stepTestReports',
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

    it('4. User posts pipeline to add stepTestReports',
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

    it('5. User post PipelineSteps to add stepTestReports',
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

    it('6. User post Runs to add stepTestReports',
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

    it('7. User post steps to add stepTestReports',
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

    it('8. User can add new stepTestReports',
      function (done) {
        var body = {
          "projectId": project.id,
          "stepId": step.id,
          "totalTests": 10,
          "totalErrors": 2,
          "totalFailures": 2,
          "totalPassing": 4,
          "totalSkipped": 2
        };
        userApiAdapter.postStepTestReports(body,
          function (err, stestreport) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add stepTestReports',
                    util.inspect(err))
                 )
               );
             stepTestReports = stestreport;
             return done();
          }
        );
      }
    );

    it('9. User can get their stepTestReports',
      function (done) {
        var query = 'stepIds=' + step.id;
        userApiAdapter.getStepTestReports(query,
          function (err, steprepo) {
            if (err || _.isEmpty(steprepo))
              return done(
                new Error(
                  util.format('User cannot get stepTestReports',
                    query, err)
                )
              );
            return done();
          }
        );
      }
    );

    // it('10. user can get their stepTestReports by steplets Id',
    //   function (done) {
    //     userApiAdapter.getStepTestReportsByStepletsId(steplets.id,
    //       function (err, result) {
    //         if (err)
    //           return done(
    //             new Error(
    //               util.format('User cannot get stepTestReports',
    //                 result, err)
    //             )
    //           );
    //         return done();
    //       }
    //     );
    //   }
    // );

    it('11. StepTestReports Id field in stepTestReports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepTestReports.id, 'StepTestReports Id cannot be null');
        assert.equal(typeof(stepTestReports.id), 'number');
        return done();
      }
    );

    it('12. StepTestReports durationSeconds field in stepTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepTestReports.durationSeconds), 'object');
        return done();
      }
    );

    it('13. StepTestReports errorDetails in stepTestReports API should be a string type',
      function (done) {
        assert.equal(typeof(stepTestReports.errorDetails), 'object');
        return done();
      }
    );

    it('14. StepTestReports failureDetails in stepTestReports API should be a string type',
      function (done) {
        assert.equal(typeof(stepTestReports.failureDetails), 'object');
        return done();
      }
    );

    it('15. StepTestReports projectId field in stepTestReports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepTestReports.projectId, 'StepTestReports projectId cannot be null');
        assert.equal(typeof(stepTestReports.projectId), 'number');
        return done();
      }
    );

    it('16. StepTestReports stepId field in stepTestReports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepTestReports.stepId, 'StepTestReports stepId cannot be null');
        assert.equal(typeof(stepTestReports.stepId), 'number');
        return done();
      }
    );

    it('17. StepTestReports totalTests field in stepTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepTestReports.totalTests), 'number');
        return done();
      }
    );

    it('18. StepTestReports totalErrors field in stepTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepTestReports.totalErrors), 'number');
        return done();
      }
    );

    it('19. StepTestReports totalFailures field in stepTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepTestReports.totalFailures), 'number');
        return done();
      }
    );

    it('20. StepTestReports totalPassing field in stepTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepTestReports.totalPassing), 'number');
        return done();
      }
    );

    it('21. StepTestReports totalSkipped field in stepTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepTestReports.totalSkipped), 'number');
        return done();
      }
    );

    it('22. StepTestReports CreatedAt field in stepTestReports API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepTestReports.createdAt, 'StepTestReports created at cannot be null');
        assert.equal(typeof(stepTestReports.createdAt), 'string');
        return done();
      }
    );

    it('23. StepTestReports UpdatedAt field in stepTestReports API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepTestReports.updatedAt, 'StepTestReports updated at cannot be null');
        assert.equal(typeof(stepTestReports.updatedAt), 'string');
        return done();
      }
    );

    it('24. User can delete stepTestReports by Id',
      function (done) {
         userApiAdapter.deleteStepTestReportsById(stepTestReports.id,
           function (err, stestreport) {
             if (err || _.isEmpty(stestreport))
               return done(
                 new Error(
                   util.format('User cannot delete stepTestReports by Id',
                     stepTestReports.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('25. user can delete stepTestReports by stepletId',
      function (done) {
        userApiAdapter.deleteStepTestReportsByStepId(step.id,
          function (err, step) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot delete stepTestReports by stepId',
                    stepTestReports.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('26. user can delete stepTestReports by pipelineId',
      function (done) {
        userApiAdapter.deleteStepTestReportsByPipelineId(pipeline.id,
          function (err, pipe) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot delete stepTestReports by pipelineId',
                    stepTestReports.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('27. User can delete pipelineSteps by Id for stepTestReports',
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

    it('28. User can delete pipelines by Id for stepTestReports',
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

    it('29. User can delete pipelineSource by Id for stepTestReports',
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

    it('30. User can delete integration by Id for stepTestReports',
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
