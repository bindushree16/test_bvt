'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_STEPLET_COVERAGE_REPORTS';
var testSuiteDesc = 'Github Organization Steplet Coverage Report API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var pipeline = {};
    var pipelineStep = {};
    var run = {};
    var step = {}; 
    var steplet = {};
    var stepletCoverageReport = {};

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
          "name": 'gitHubIntegration',
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
            pipelineStep = psteps;
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
          "name" : "Step_1",
          "pipelineId": pipeline.id,
          "pipelineStepId": pipelineStep.id,
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
  
    it('9. User can add new steplet coverage report',
      function (done) {
        var body = {
          "classes": [
            {"lineRate":0.7273,"branchRate":0.5,"name":".","fileName":"sampleApp.py"},
            {"lineRate":0.8182,"branchRate":0.5,"name":".","fileName":"sampleTest.py"}
          ],
          "branchCoverage": {
            "coveredBranches":0,"validBranches":0,"branchRate":0.5
          },
          "lineCoverage": {
            "lineRate":0.7727,"validLines":0,"coveredLines":0
          },
          "stepletId": steplet.id,
          "projectId": project.id
        };
        userApiAdapter.postStepletCoverageReport(body,
          function (err, stepletsCoverage) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add steplets coverage reports',
                    util.inspect(err))
                 )
               );
             stepletCoverageReport = stepletsCoverage;
             return done();
          }
        );
      }
    );
    
//    it('10. user can get steplet coverage reports by steplet Id',
//      function (done) {
//        userApiAdapter.getStepletCoverageReportsByStepletId(steplet.id,
//          function (err, stepletCoverage) {
//            if (err || _.isEmpty(stepletCoverage))
//              return done(
//                new Error(
//                  util.format('User cannot get steplet coverage reports by steplet Id',
//                    stepletCoverage, err)
//                )
//              );
//            stepletCoverageReport = stepletCoverage;
//            return done();
//          }
//        );
//      }
//    );

    it('11. User can get their steplet coverage reports',
      function (done) {
        var query = 'stepletIds=' + steplet.id;
        userApiAdapter.getStepletCoverageReports(query,
          function (err, stepletCoverage) {
            if (err || _.isEmpty(stepletCoverage))
              return done(
                new Error(
                  util.format('User cannot get steplet coverage report',
                    stepletCoverage, err)
                )
              );
            stepletCoverageReport = _.first(stepletCoverage);
            return done();
          }
        );
      }
    );
  
    it('12. Id field in steplet coverage reports API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(stepletCoverageReport.id, 'Id field cannot be null');
        assert.equal(typeof(stepletCoverageReport.id), 'number');
        return done();
      }
    );
  
    it('13. BranchCoverage field in steplet coverage reports API should be an object type',
      function (done) {
        assert.equal(typeof(stepletCoverageReport.branchCoverage), 'object');
        return done();
      }
    );
  
    it('14. Classes field in steplet coverage reports API should not be null and should be an object type',
      function (done) {
        assert.isNotNull(stepletCoverageReport.classes, 'classes field cannot be null');
        assert.equal(typeof(stepletCoverageReport.classes), 'object');
        return done();
      }
    );
  
    it('15. LineCoverage field in steplet coverage reports API should be an object type',
      function (done) {
        assert.equal(typeof(stepletCoverageReport.lineCoverage), 'object');
        return done();
      }
    );
  
    it('16. Project Id field in steplet coverage reports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepletCoverageReport.projectId, 'Project Id field cannot be null');
        assert.equal(typeof(stepletCoverageReport.projectId), 'number');
        return done();
      }
    );
  
    it('17. Steplet Id field in steplet coverage reports API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(stepletCoverageReport.stepletId, 'Steplet Id field cannot be null');
        assert.equal(typeof(stepletCoverageReport.stepletId), 'number');
        return done();
      }
    );
  
    it('18. Created At field in steplet coverage reports API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletCoverageReport.createdAt, 'Created At field cannot be null');
        assert.equal(typeof(stepletCoverageReport.createdAt), 'string');
        return done();
      }
    );
  
    it('19. Updated At field in steplet coverage reports API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(stepletCoverageReport.updatedAt, 'Updated At field cannot be null');
        assert.equal(typeof(stepletCoverageReport.updatedAt), 'string');
        return done();
      }
    );

    it('20. User can delete steplet coverage report by Id',
      function (done) {
         userApiAdapter.deleteStepletCoverageReportById(stepletCoverageReport.id,
            function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete steplet coverage report by Id',
                     stepletCoverageReport.id, err)
                 )
                );
             return done();
           }
         );
       }
    );
    
    it('21. User can delete steplet coverage report by Steplet Id',
      function (done) {
         userApiAdapter.deleteStepletCoverageReportByStepletId(steplet.id,
            function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete steplet coverage report by Id',
                     stepletCoverageReport.id, err)
                 )
                );
             return done();
           }
         );
       }
    );
  
    it('22. User can delete steplet coverage report by pipeline Id',
      function (done) {
         userApiAdapter.deleteStepletCoverageReportByPipelineId(pipeline.id,
            function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete steplet coverage report by Id',
                     stepletCoverageReport.id, err)
                 )
                );
             return done();
           }
         );
       }
    );
  
    it('23. User can delete pipelines by Id',
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

    it('24. User can delete pipelineSource by Id',
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

    it('25. User can deletes integration by Id',
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