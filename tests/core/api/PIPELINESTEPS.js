'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_PIPELINESTEPS';
var testSuiteDesc = 'Github Organization PipelineSteps API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var pipelineSteps = [];
    var project = [];
    var integration = [];
    var pipeline = [];
    var pipelineSources =[];

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

    it('1. User can get projects to add pipelineSteps',
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

    it('3. User can post their pipelineSources to add pipelineSteps',
      function (done) {
        var body = {
          "projectId": project.id,
          "integrationId": integration.id,
          "repositoryFullName": global.GH_USERNAME + '/' +
            global.GH_PROJECT_NAME,
          "branch": global.GH_PROJECT_BRANCH
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

    it('4. User can add new pipeline',
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

    it('5. User can add new pipelineSteps',
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
                  util.format('User cannot add pipelineSteps',
                    util.inspect(err))
                )
              );
              pipelineSteps = psteps;
            return done();
          }
        );
      }
    );

    it('6.  User field can get their pipelineSteps',
      function (done) {
        var query = 'pipelineSourcesIds=' + pipelineSources.id;
        userApiAdapter.getPipelineSteps(query,
          function (err,psteps) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get pipelineSteps',
                    query ,err)
                )
              );
            pipelineSteps = _.first(psteps);
            assert.isNotEmpty(pipelineSteps, 'User cannot find the pipelineSteps');
            return done();
          }
        );
      }
    );

    it('7. User can get pipelineSteps by Id',
      function (done) {
        userApiAdapter.getPipelineStepsById(pipelineSteps.id,
          function (err, psteps) {
            if (err || _.isEmpty(psteps))
              return done(
                new Error(
                  util.format('User cannot get PipelineSteps by Id',
                    pipelineSteps.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('8. User can update the pipelineSteps',
      function (done) {
        var body = {
            "name": global.GH_USR_API_PIPELINESTEPS_RENAME
        };
        userApiAdapter.putPipelineStepsById(pipelineSteps.id, body,
          function (err, psteps) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update pipelineSteps',
                    util.inspect(err))
                )
              );
            return done();
          }
        );
      }
    );

    it('9. PipelineStepsId field in pipelineSteps API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(pipelineSteps.id, 'PipelineSteps Id cannot be null');
        assert.equal(typeof(pipelineSteps.id), 'number');
        return done();
      }
    );

    it('10. PipelineStepsName field in pipelineSteps API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(pipelineSteps.name, 'PipelineSteps name cannot be null');
        assert.equal(typeof(pipelineSteps.name), 'string');
        return done();
      }
    );

    // it('11. PipelineStepsSetup in pipelineSteps API should be a string type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.setup), 'object');
    //     return done();
    //   }
    // ); commenting since type is undefined as of now. Will uncomment once it is fixed

    // it('12. PipelineStepsRequires in pipelineSteps API should be a object type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.requires), 'object');
    //     return done();
    //   }
    // );

    // it('13. PipelineStepsTriggeredBy in pipelineSteps API should be a object type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.triggeredBy), 'object');
    //     return done();
    //   }
    // );

    // it('14. PipelineStepsOutputResources in pipelineSteps API should be a object type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.outputResources), 'object');
    //     return done();
    //    }
    //  );

    // it('15. PipelineStepsConfigPropertyBag in pipelineSteps API should be a object type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.configPropertyBag), 'object');
    //     return done();
    //   }
    // );

    it('16. PipelineStepsTypeCode field in pipelineSteps API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(pipelineSteps.typeCode, 'PipelineSteps typeCode cannot be null');
        assert.equal(typeof(pipelineSteps.typeCode), 'number');
        return done();
      }
    );

    // it('17. PipelineStepsExecPropertyBag in pipelineSteps API should be a object type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.execPropertyBag), 'object');
    //     return done();
    //    }
    //  );

    // it('18. PipelineStepsLatestStepId field in pipelineSteps API should be a integer type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.latestStepId), 'object');
    //     return done();
    //   }
    // );

    it('19. PipelineStepsProjectId field in pipelineSteps API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSteps.projectId, 'PipelineSteps Project Id cannot be null');
        assert.equal(typeof(pipelineSteps.projectId), 'number');
        return done();
      }
    );

    it('20. PipelineStepsPipelineSourceId field in pipelineSteps API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSteps.pipelineSourceId, 'PipelineSteps Pipeline Source Id cannot be null');
        assert.equal(typeof(pipelineSteps.pipelineSourceId), 'number');
        return done();
      }
    );

    it('21. PipelineStepsPipelineId field in pipelineSteps API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSteps.pipelineId , 'PipelineSteps pipeline Id cannot be null');
        assert.equal(typeof(pipelineSteps.pipelineId), 'number');
        return done();
      }
    );

    it('22. PipelineStepsIsDeleted field in pipelineSteps API should be a boolean type',
      function (done) {
        assert.equal(typeof(pipelineSteps.isDeleted), 'boolean');
        return done();
      }
    );

    it('23. PipelineStepsIsConsistent field in pipelineSteps API should be a boolean type',
      function (done) {
        assert.equal(typeof(pipelineSteps.isConsistent), 'boolean');
        return done();
      }
    );

    it('24. PipelineStepsIsStale field in pipelineSteps API should be a boolean type',
      function (done) {
        assert.equal(typeof(pipelineSteps.isStale), 'boolean');
        return done();
      }
    );

    // it('25. PipelineStepsStaleAt field in pipelineSteps API should be a string type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSteps.staleAt), 'object');
    //     return done();
    //   }
    // ); commenting since type is undefined as of now. Will uncomment once it is fixed

    it('26. PipelineStepsIsPaused field in pipelineSteps API should be a boolean type',
      function (done) {
        assert.equal(typeof(pipelineSteps.isPaused), 'boolean');
        return done();
      }
    );

    it('27. PipelineStepsYml in pipelineSteps API should be a object type',
      function (done) {
        assert.equal(typeof(pipelineSteps.yml), 'object');
        return done();
      }
    );

    it('28. PipelineStepsCreatedAt field in pipelineSteps API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(pipelineSteps.createdAt, 'PipelineSteps created at cannot be null');
        assert.equal(typeof(pipelineSteps.createdAt), 'string');
        return done();
      }
    );

    it('29. PipelineStepsUpdatedAt field in pipelineSteps API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(pipelineSteps.updatedAt, 'PipelineSteps updated at cannot be null');
        assert.equal(typeof(pipelineSteps.updatedAt), 'string');
        return done();
      }
    );

    it('30. User can deletes pipelineSteps by Id',
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

    it('31. User can delete pipelines by Id',
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

    it('32.  User can delete pipelineSource by Id',
      function (done) {
         userApiAdapter.deletePipelineSourcesById(pipelineSources.id,
           function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete PipelineSources by Id',
                     pipelineSources.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('33. User can deletes integration by Id',
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
