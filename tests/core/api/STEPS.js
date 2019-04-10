'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_STEPS';
var testSuiteDesc = 'Github Organization steps API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var step = [];
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var pipeline = {};
    var pipelineSteps = {};
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

    it('8. user can get steps by Id',
      function (done) {
        userApiAdapter.getStepsById(step.id,
          function (err, result) {
            if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot get step by Id',
                    step.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('9. user can update the steps',
      function (done) {
        var body = {
          "statusCode": 4003
        };
        userApiAdapter.putStepById(step.id, body,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update step',
                    util.inspect(err))
                )
              );
            return done();
          }
        );
      }
    );

    it('10. user can get their steps',
      function (done) {
        userApiAdapter.getSteps('',
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get steps',
                    query, err)
                )
              );
             step = _.first(result);
            assert.isNotEmpty(result, 'User cannot find the steps');
            return done();
          }
        );
      }
    );

    it('11. id field in steps API shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(step.id, 'step id field cannot be null');
        assert.equal(typeof(step.id), 'number');
        return done();
      }
    );

    it('12. pipelineId field in steps API' +
      'shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(step.pipelineId,
          'steps pipelineId field cannot be null');
        assert.equal(typeof(step.pipelineId), 'number');
        return done();
      }
    );

    it('13. pipelineStepId field in steps API' +
      'shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(step.pipelineStepId,
          'steps pipelineStepId field cannot be null');
        assert.equal(typeof(step.pipelineStepId), 'number');
        return done();
      }
    );

    it('14. ProjectId field in steps API' +
      'shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(step.projectId,
          'steps ProjectId created by cannot be null');
        assert.equal(typeof(step.projectId), 'number');
        return done();
      }
    );

    it('15.name field in steps API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(step.name, ' steps name field cannot be null');
        assert.equal(typeof(step.name), 'string');
        return done();
      }
    );

    it('16. runId field in steps API shouldnot' +
       'be null and should be a integer',
      function (done) {
        assert.isNotNull(step.runId, 'steps runId field cannot be null');
        assert.equal(typeof(step.runId), 'number');
        return done();
      }
    );

    it('17. statusCode field in steps API' +
      'shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(step.statusCode,
          'steps statusCode field cannot be null');
        assert.equal(typeof(step.statusCode), 'number');
        return done();
      }
    );

    // it('18. affinityGroup field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.affinityGroup), 'string');
    //     return done();
    //   }
    // );
    //
    // it('19. fileStoreProvider field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(steps.fileStoreProvider), 'string');
    //     return done();
    //   }
    // );
    //
    // it('20. triggeredByResourceVersionId' +
    //     'field in steps API should be a integer',
    //   function (done) {
    //     assert.equal(typeof(step.triggeredByResourceVersionId), 'number');
    //     return done();
    //   }
    // );
    //
    // it('21. triggeredByStepId field in steps API should be a integer',
    //   function (done) {
    //     assert.equal(typeof(step.triggeredByStepId), 'number');
    //     return done();
    //   }
    // );
    //
    // it('22. triggeredByResourceVersionId field in' +
    //     'steps API should be a integer',
    //   function (done) {
    //     assert.equal(typeof(step.triggeredByResourceVersionId), 'number');
    //     return done();
    //   }
    // );
    //
    // it('23. triggeredByIdentityId field in steps API should be a integer',
    //   function (done) {
    //     assert.equal(typeof(step.triggeredByIdentityId), 'number');
    //     return done();
    //   }
    // );
    //
    // it('24. configPropertyBag field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.configPropertyBag), 'string');
    //     return done();
    //   }
    // );
    //
    // it('25. execPropertyBag field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.execPropertyBag), 'string');
    //     return done();
    //   }
    // );
    //
    // it('26. setup field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.setup), 'string');
    //     return done();
    //   }
    // );
    //
    // it('27. externalBuildId field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.externalBuildId), 'string');
    //     return done();
    //   }
    // );
    //
    // it('28. externalBuildUrl field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.externalBuildUrl), 'string');
    //     return done();
    //   }
    // );
    //
    // it('29. timeoutAt field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.timeoutAt), 'string');
    //     return done();
    //   }
    // );
    //
    // it('30. startedAt field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.startedAt), 'string');
    //     return done();
    //   }
    // );
    //
    // it('31. queuedAt field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.queuedAt), 'string');
    //     return done();
    //   }
    // );
    //
    // it('32. endedAt field in steps API should be a string',
    //   function (done) {
    //     assert.equal(typeof(step.endedAt), 'string');
    //     return done();
    //   }
    // );

    it('33.CreatedAt field in steps API shouldnot be null and should be a date',
      function (done) {
        assert.isNotNull(step.createdAt,
          'steps createdAt field cannot be null');
        assert.equal(typeof(step.createdAt), 'string');
        return done();
      }
    );

    it('34.UpatedAt field in steps API shouldnot be null and should be a date',
      function (done) {
        assert.isNotNull(step.updatedAt,
          'steps updatedAt field cannot be null');
        assert.equal(typeof(step.updatedAt), 'string');
        return done();
      }
    );

    it('35. user can delete step by Id',
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

    it('36.  User can delete by runs',
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

    it('37. User can deletes pipelineSteps by Id',
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

    it('38.  User can delete pipelines by Id',
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

    it('39. User can delete pipelineSource by Id',
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

    it('40. User can deletes integration by Id',
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
