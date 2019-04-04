'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_PIPELINESOURCES';
var testSuiteDesc = 'Github Organization PipelineSources API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = global.newApiAdapterByToken(
      global.SHIPPABLE_API_TOKEN);
    var pipelineSource = [];
    var project = {};
    var integration = {};

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

    it('2. User can post their integration',
      function postGitIntegration(done) {
        var body = {
         "masterIntegrationId": 20,
         "masterIntegrationName": "github",
         "name": 'git42',
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

    it('3. User add new PipelineSources',
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
            setTimeout(
              function () {
                return done();
              }, 60 * 1000
            );
          }
        );
      }
    );


    it('4. User can get their pipelinesources by Id',
      function (done) {
        userApiAdapter.getPipelineSourcesById(pipelineSource.id,
          function (err, piplinsid) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get pipelineSource by Id', err)
                )
              );
            pipelineSource = piplinsid;

            assert.isNotEmpty(piplinsid, 'User cannot find the pipelineSourcesId');
            return done();
          }
        );
      }
    );

    it('5. User can update the pipelineSource by Id',
      function (done) {
        var body = {
            "isSyncing": true
        };
        userApiAdapter.putPipelineSourcesById(pipelineSource.id, body,
          function (err, piplin) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update pipelinesource',
                    util.inspect(err))
                  )
                );
            return done();
          }
        );
      }
    );


    it('6.  User field can get their pipelinesources',
      function (done) {
         userApiAdapter.getPipelineSources('',
           function (err, piplin) {
             if (err)
               return done(
                new Error(
                  util.format('User cannot get pipelineSources', err)
                 )
              );
             pipelineSource = _.first(piplin);
             assert.isNotEmpty(pipelineSource, 'User cannot find the pipelineSources');
             return done();
          }
        );
      }
    );

    it('7. Id field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSource.id, 'Id cannot be null');
        assert.equal(typeof(pipelineSource.id), 'number');
        return done();
      }
    );

    it('8. ProjectId field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSource.projectId, 'ProjectId cannot be null');
        assert.equal(typeof(pipelineSource.projectId), 'number');
        return done();
      }
    );

    it('9. RepositoryFullName field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.repositoryFullName, 'RepositoryFullName cannot be null');
        assert.equal(typeof(pipelineSource.repositoryFullName), 'string');
        return done();
      }
    );

    it('10. Branch field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.branch, ' Branch cannot be null');
        assert.equal(typeof(pipelineSource.branch), 'string');
        return done();
      }
    );

    it('11. FileFilter field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.fileFilter, 'FileFilter cannot be null');
        assert.equal(typeof(pipelineSource.fileFilter), 'string');
        return done();
      }
    );

    it('12. IntegrationId field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSource.integrationId, 'IntegrationId cannot be null');
        assert.equal(typeof(pipelineSource.integrationId), 'number');
        return done();
      }
    );

    it('13. IsSyncing field in pipelineSource API should be a boolean type',
      function (done) {
        assert.isNotNull(pipelineSource.isSyncing, 'IsSyncing cannot be null');
        assert.equal(typeof(pipelineSource.isSyncing), 'boolean');
        return done();
      }
    );

    it('14. LastSyncStatusCode field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSource.lastSyncStatusCode, 'LastSyncStatusCode cannot be null');
        assert.equal(typeof(pipelineSource.lastSyncStatusCode), 'number');
        return done();
      }
    );

    it('15. LastSyncStartedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.lastSyncStartedAt, 'PipelineSources cannot be null');
        assert.equal(typeof(pipelineSource.lastSyncStartedAt), 'string');
        return done();
      }
    );

    it('16. LastSyncEndedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.lastSyncEndedAt, 'LastSyncStartedAt cannot be null');
        assert.equal(typeof(pipelineSource.lastSyncEndedAt), 'string');
        return done();
      }
    );

    // it('17. LastSyncLogs field in pipelineSource API should be an object type',
    //   function (done) {
    //     assert.equal(typeof(pipelineSource.lastSyncLogs), 'object');
    //     return done();
    //   }
    // );

    it('18. ResourceId field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(pipelineSource.resourceId, 'ResourceId cannot be null');
        assert.equal(typeof(pipelineSource.resourceId), 'number');
        return done();
      }
    );

    // it('19. CreatedBy field in pipelineSource API shouldnot be null and should be a string',
    //    function (done) {
    //   assert.isNotNull(pipelineSource.createdBy, 'CreatedBy cannot be null');
    //       assert.equal(typeof(pipelineSource.createdBy), 'string');
    //       return done();
    //     }
    //   );

    // it('20. UpdatedBy field in pipelineSource API shouldnot be null and should be a string',
    //   function (done) {
    //     assert.isNotNull(pipelineSource.updatedBy, 'UpdatedBy cannot be null');
    //     assert.equal(typeof(pipelineSource.updatedBy), 'string');
    //     return done();
    //   }
    // );

    it('21. CreatedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.createdAt, 'CreatedAt cannot be null');
        assert.equal(typeof(pipelineSource.createdAt), 'string');
        return done();
      }
    );

    it('22. UpdatedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(pipelineSource.updatedAt, 'UpdatedAt cannot be null');
        assert.equal(typeof(pipelineSource.updatedAt), 'string');
        return done();
      }
    );

    it('23.  User can delete pipelineSource by Id',
      function (done) {
         userApiAdapter.deletePipelineSourcesById(pipelineSource.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('User cannot delete PipelineSources by Id',
                     PipelineSource.id, err)
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
