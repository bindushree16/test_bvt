'use strict';

var testSetup = require('../../../testSetup.js');
var backoff = require('backoff');

var testSuite = 'API_PIPELINESTEPCONNECTIONS';
var testSuiteDesc = 'Github Organization pipelineStepConnections API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var pipelineStepConnection = [];
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var pipeline = {};
    var pipelineSteps = {};

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

    it('1. user can get their projects',
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

    it('2. user posts github integration to add pipelineSources',
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

    it('3. user posts PipelineSources to add pipelines',
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

    it('4. user posts pipeline to add PipelineSteps',
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

    it('5. user post PipelineSteps to add pipelineStepConnections',
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

    it('6. user can add new pipelineStepConnections',
          function (done) {
            var body = {
              "projectId": 1,
              "pipelineId": 1,
              "pipelineStepId": 1,
              "operation": "IN"
            };
            userApiAdapter.postPipelineStepConnection(body,
              function (err, pipelineStepConnections) {
                if (err)
                  return done(
                    new Error(
                      util.format('User cannot add PipelineStepConnection',
                        util.inspect(err))
                     )
                   );
                 pipelineStepConnection = pipelineStepConnections;
                 return done();
              }
            );
          }
        );

    it('7. user can get their pipelineStepConnections by Id',
      function (done) {
        userApiAdapter.getPipelineStepConnectionById(pipelineStepConnection.id,
          function (err, pipelineStepConnections) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get pipelineStepConnection by Id', err)
                )
              );
             pipelineStepConnection = pipelineStepConnections;
            assert.isNotEmpty(pipelineStepConnections, 'User cannot find the pipelineStepConnection Id');
            return done();
          }
        );
      }
    );

    it('8. user can update the pipelineStepConnections by Id',
      function (done) {
        var body = {
           "isTrigger": false
        };
        userApiAdapter.putPipelineStepConnectionById(pipelineStepConnection.id, body,
          function (err, pipelineStepConnections) {
            if (err)
              return done(
              new Error(
                  util.format('User cannot update pipelineStepConnection',
                  util.inspect(err))
                 )
                );
            return done();
          }
        );
      }
    );

    it('9. user can get their pipelineStepConnections',
      function (done) {
        userApiAdapter.getPipelineStepConnections('',
          function (err, pipelineStepConnections) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get pipelineStepConnection', err)
                )
               );
             pipelineStepConnection = _.first(pipelineStepConnections);
             assert.isNotEmpty(pipelineStepConnections, 'User cannot find the pipelineStepConnection');
             return done();
          }
        );
      }
    );

    it('10. Id in pipelineStepConnections API shouldnot be null and should be a integer type',
     function (done) {
        assert.isNotNull(pipelineStepConnection.id, 'Id cannot be null');
        assert.equal(typeof(pipelineStepConnection.id), 'number');
        return done();
      }
    );

    it('11. pipelineStepId in pipelineStepConnections API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineStepConnection.pipelineStepId, 'PipelineStepId cannot be null');
        assert.equal(typeof(pipelineStepConnection.pipelineStepId), 'number');
        return done();
      }
    );

    it('12. pipelineId in pipelineStepConnections API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineStepConnection.pipelineId, 'pipelineId cannot be null');
        assert.equal(typeof(pipelineStepConnection.pipelineId), 'number');
        return done();
      }
    );

    it('13. projectId in pipelineStepConnections API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineStepConnection.projectId, 'projectId Number cannot be null');
        assert.equal(typeof(pipelineStepConnection.projectId), 'number');
        return done();
      }
    );

    it('14. isTrigger in pipelineStepConnections API shouldnot be null and should be a boolean type',
      function (done) {
        assert.isNotNull( pipelineStepConnection.isTrigger, 'isTrigger cannot be null');
        assert.equal(typeof( pipelineStepConnection.isTrigger), 'boolean');
        return done();
      }
    );

    it('15. operation in pipelineStepConnections API shouldnot be null and should be a string type',
     function (done) {
        assert.isNotNull(pipelineStepConnection.operation, 'operation cannot be null');
        assert.equal(typeof(pipelineStepConnection.operation), 'string');
        return done();
      }
    );

    // it('16. operationResourceId in pipelineStepConnections API should be a integer type',
    //       function (done) {
    //         assert.equal(typeof(pipelineStepConnection.operationResourceId), 'number');
    //         return done();
    //       }
    //     );
    //
    // it('17. operationResourceName in pipelineStepConnections API should be a string type',
    //   function (done) {
    //     assert.equal(typeof(pipelineStepConnection.operationResourceName), 'string');
    //     return done();
    //   }
    // );
    //
    // it('18. operationPipelineStepId in pipelineStepConnections API should be a integer type',
    //   function (done) {
    //     assert.equal(typeof(pipelineStepConnection.operationPipelineStepId), 'number');
    //     return done();
    //   }
    // );
    //
    // it('19. operationPipelineStepName in pipelineStepConnections API should be a string type',
    //   function (done) {
    //     assert.equal(typeof(pipelineStepConnection.operationPipelineStepName), 'string');
    //     return done();
    //   }
    // );
    //
    // it('20. operationIntegrationId in pipelineStepConnections API should be a integer type',
    //   function (done) {
    //     assert.equal(typeof(pipelineStepConnection.operationIntegrationId), 'number');
    //     return done();
    //   }
    // );
    //
    // it('21. operationIntegrationName in pipelineStepConnections API should be a string type',
    //   function (done) {
    //     assert.equal(typeof(pipelineStepConnection.operationIntegrationName), 'string');
    //     return done();
    //   }
    // );

    it('22. createdAt in pipelineStepConnections API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(pipelineStepConnection.createdAt, 'createdAt cannot be null');
        assert.equal(typeof(pipelineStepConnection.createdAt), 'string');
        return done();
      }
    );

    it('23. updatedAt in pipelineStepConnections shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(pipelineStepConnection.updatedAt, 'UpdatedAt cannot be null');
        assert.equal(typeof(pipelineStepConnection.updatedAt), 'string');
        return done();
      }
    );

    it('24. user can delete by pipelineStepConnections By Id',
      function (done) {
         userApiAdapter.deletePipelineStepConnectionById(pipelineStepConnection.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('User cannot delete pipelineStepConnections by Id',
                     run.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('25. user can delete pipelineSource by Id',
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

    it('26. user can deletes integration by Id',
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
