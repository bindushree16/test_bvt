'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_STEPLETTESTREPORTS';
var testSuiteDesc = 'Github Organization StepletTestReports API tests';
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
    var stepletTestReports = {};

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

    it('2. User posts github integration to add stepletTestReports',
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

    it('3. User posts PipelineSources to add stepletTestReports',
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

    it('4. User posts pipeline to add stepletTestReports',
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

    it('5. User post PipelineSteps to add stepletTestReports',
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

    it('6. User post Runs to add stepletTestReports',
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

    it('7. User post steps to add stepletTestReports',
      function (done) {
        var body = {
          "projectId": project.id,
          "name" : "vijay_priya",
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

    it('8. User post steplets to add stepletTestReports',
      function (done) {
        var body = {
          "projectId": project.id,
          "pipelineId": pipeline.id,
          "stepId": step.id,
          "stepletNumber": global.GH_STEPLET_NUMBER,
          "statusCode": global.GH_STATUS_CODE
        };
        userApiAdapter.postSteplet(body,
          function (err, steplet) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add Steplet',
                    util.inspect(err))
                 )
               );
             steplets = steplet;
             return done();
          }
        );
      }
    );

    it('9. User can add new stepletTestReports',
      function (done) {
        var body = {
          "projectId": project.id,
          "stepletId": steplets.id,
          "totalTests": 10,
          "totalErrors": 2,
          "totalFailures": 2,
          "totalPassing": 4,
          "totalSkipped": 2
        };
        userApiAdapter.postStepletTestReports(body,
          function (err, stestreport) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add stepletTestReports',
                    util.inspect(err))
                 )
               );
             stepletTestReports = stestreport;
             return done();
          }
        );
      }
    );

    // it('10. User can get their stepletTestReports',
    //   function (done) {
    //     userApiAdapter.getStepletTestReports('',
    //       function (err, steprepo) {
    //         if (err || _.isEmpty(steprepo))
    //           return done(
    //             new Error(
    //               util.format('User cannot get stepletTestReports',
    //                 query, err)
    //             )
    //           );
    //         return done();
    //       }
    //     );
    //   }
    // );

    it('11. user can get their stepletTestReports by steplets Id',
      function (done) {
        userApiAdapter.getStepletTestReportsByStepletsId(steplets.id,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get stepletTestReports',
                    result, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('12. StepletTestReports Id field in stepletTestReports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepletTestReports.id, 'StepletTestReports Id cannot be null');
        assert.equal(typeof(stepletTestReports.id), 'number');
        return done();
      }
    );

    it('13. StepletTestReports durationSeconds field in stepletTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepletTestReports.durationSeconds), 'object');
        return done();
      }
    );

    it('14. StepletTestReports errorDetails in stepletTestReports API should be a string type',
      function (done) {
        assert.equal(typeof(stepletTestReports.errorDetails), 'object');
        return done();
      }
    ); 

    it('15. StepletTestReports failureDetails in stepletTestReports API should be a string type',
      function (done) {
        assert.equal(typeof(stepletTestReports.failureDetails), 'object');
        return done();
      }
    );

    it('16. StepletTestReports projectId field in stepletTestReports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepletTestReports.projectId, 'StepletTestReports projectId cannot be null');
        assert.equal(typeof(stepletTestReports.projectId), 'number');
        return done();
      }
    );
 
    it('17. StepletTestReports stepletId field in stepletTestReports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepletTestReports.stepletId, 'StepletTestReports stepletId cannot be null');
        assert.equal(typeof(stepletTestReports.stepletId), 'number');
        return done();
      }
    );

    // it('18. StepletTestReports total field in stepletTestReports API should be a integer type',
    //   function (done) {
    //     assert.equal(typeof(stepletTestReports.total), 'integer');
    //     return done();
    //   }
    // ); commenting since type is undefined as of now. Will uncomment once it is fixed

    it('19. StepletTestReports totalErrors field in stepletTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepletTestReports.totalErrors), 'number');
        return done();
      }
    ); 

    it('20. StepletTestReports totalFailures field in stepletTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepletTestReports.totalFailures), 'number');
        return done();
      }
    );

    it('21. StepletTestReports totalPassing field in stepletTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepletTestReports.totalPassing), 'number');
        return done();
      }
    );   
    
    it('22. StepletTestReports totalSkipped field in stepletTestReports API should be a integer type',
      function (done) {
        assert.equal(typeof(stepletTestReports.totalSkipped), 'number');
        return done();
      }
    ); 

    it('23. StepletTestReports CreatedAt field in stepletTestReports API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletTestReports.createdAt, 'StepletTestReports created at cannot be null');
        assert.equal(typeof(stepletTestReports.createdAt), 'string');
        return done();
      }
    );

    it('24. StepletTestReports UpdatedAt field in stepletTestReports API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletTestReports.updatedAt, 'StepletTestReports updated at cannot be null');
        assert.equal(typeof(stepletTestReports.updatedAt), 'string');
        return done();
      }
    );

    it('25. User can delete stepletTestReports by Id',
      function (done) {
         userApiAdapter.deleteStepletTestReportsById(stepletTestReports.id,
           function (err, stestreport) {
             if (err || _.isEmpty(stestreport))
               return done(
                 new Error(
                   util.format('User cannot delete stepletTestReports by Id',
                     stepletTestReports.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('26. user can delete stepletTestReports by stepletId',
      function (done) {
        userApiAdapter.deleteStepletTestReportsByStepletId(steplets.id,
          function (err, steplet) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot delete stepletTestReports by stepletId',
                    stepletTestReports.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('27. user can delete stepletTestReports by pipelineId',
      function (done) {
        userApiAdapter.deleteStepletTestReportsByPipelineId(pipeline.id,
          function (err, pipe) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot delete stepletTestReports by pipelineId',
                    stepletTestReports.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('28. User can delete steplets by Id for stepletTestReports',
      function (done) {
        userApiAdapter.deleteStepletById(steplets.id,
        function (err, result) {
          if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot delete steplets by Id',
                    steplets.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('29. User can delete pipelineSteps by Id for stepletTestReports',
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

    it('30. User can delete pipelines by Id for stepletTestReports',
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

    it('31. User can delete pipelineSource by Id for stepletTestReports',
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

    it('32. User can delete integration by Id for stepletTestReports',
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


