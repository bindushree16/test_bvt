'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_PIPELINESOURCES';
var testSuiteDesc = 'Github Organization PipelineSources API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var superUserApiAdapter = global.newApiAdapterByToken(
      global.SHIPPABLE_SUPERUSER_TOKEN);
    var adminApiAdapter =global.newApiAdapterByToken(
      global.SHIPPABLE_ADMIN_TOKEN)
    var memberApiAdapter = global.newApiAdapterByToken(
      global.SHIPPABLE_MEMBER_TOKEN);

    var superUserPipelineSource = {};
    var adminUserPipelineSource = {};
    var memberPipelineSource = {};
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

    it('1. Super user should be able to get their projects',
      function getProject(done) {
        superUserApiAdapter.getProjects('',
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

    it('2. Super user should be able to post their integration',
      function postGitIntegration(done) {
        var body = {
         "masterIntegrationId": 20,
         "masterIntegrationName": "github",
         "name": global.GH_NAMEGIT,
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
        superUserApiAdapter.postIntegration(body,
          function (err, int) {
            if (err)
              return done(
                new Error(
                  util.format('Super user cannot add integration',
                    util.inspect(err))
                )
              );
              integration = int;
            return done();
          }
        );
      }
    );

    it('3. Super user should be able add new PipelineSources',
      function (done) {
        var body = {
          "projectId": project.id,
          "repositoryFullName": global.GH_USERNAME + '/' +
            global.GH_PROJECT_NAME,
          "branch": global.GH_PROJECT_BRANCH,
          "integrationId": integration.id
        };
        superUserApiAdapter.postPipelineSources(body,
          function (err, pSource) {
            if (err)
              return done(
                new Error(
                  util.format('Super user cannot add PipelineSource',
                    util.inspect(err))
                )
              );
              superUserPipelineSource = pSource;
              setTimeout(
                function () {
                  return done();
                }, 60 * 1000
              );
            }
          );
        }
      );

    it('4. Admin should be able add new PipelineSources',
      function (done) {
        var body = {
          "projectId": project.id,
          "repositoryFullName":  global.GH_USERNAME + '/' +
            global.GH_ADMIN_PROJECT_NAME,
          "branch": global.GH_PROJECT_BRANCH,
          "integrationId": integration.id
        };
        adminApiAdapter.postPipelineSources(body,
          function (err, pSource) {
            if (err)
              return done(
                new Error(
                  util.format('Admin cannot add PipelineSource',
                    util.inspect(err))
                )
              );
            adminUserPipelineSource = pSource;
            setTimeout(
              function () {
                return done();
              }, 60 * 1000
            );
          }
        );
      }
    );

    it('5. Super user should be able to get their pipelineSource by Id',
      function (done) {
        var body = {
            "isSyncing": true
        };
        superUserApiAdapter.putPipelineSourcesById(superUserPipelineSource.id, body,
          function (err, piplin) {
            if (err)
              return done(
                new Error(
                  util.format('Super user cannot update pipelinesource',
                    util.inspect(err))
                  )
                );
            return done();
          }
        );
      }
    );

    it('6. Admin should be able to get their pipelineSource by Id',
      function (done) {
        var body = {
            "isSyncing": true
        };
        adminApiAdapter.putPipelineSourcesById(adminUserPipelineSource.id, body,
          function (err, piplin) {
            if (err)
              return done(
                new Error(
                  util.format('Admin cannot update pipelinesource',
                    util.inspect(err))
                  )
                );
            return done();
          }
        );
      }
    );

    it('7. Super user should be able to get their pipelinesources by Id',
      function (done) {
        superUserApiAdapter.getPipelineSourceById(superUserPipelineSource.id,
          function (err, piplinsid) {
            if (err)
              return done(
                new Error(
                  util.format('Super user cannot get pipelineSource by Id', err)
                )
              );
            superUserPipelineSource = piplinsid;
             assert.isNotEmpty(superUserApiAdapter, 'Super user cannot find the pipelineSourcesId');
            return done();
          }
        );
      }
    );

    it('8. Admin should be able to get their pipelinesources by Id',
      function (done) {
        adminApiAdapter.getPipelineSourceById(adminUserPipelineSource.id,
          function (err, piplinsid) {
            if (err)
              return done(
                new Error(
                  util.format('Admin cannot get pipelineSource by Id', err)
                )
              );
            adminUserPipelineSource = piplinsid;
            memberPipelineSource = adminUserPipelineSource;
             assert.isNotEmpty(piplinsid, 'Admin cannot find the pipelineSourcesId');
            return done();
          }
        );
      }
    );

    it('9. Member should be able to get their pipelinesources by Id',
      function (done) {
        memberApiAdapter.getPipelineSourceById(memberPipelineSource.id,

          function (err, piplinsid) {
            if (err)
              return done(
                new Error(
                  util.format('Member cannot get pipelineSource by Id', err)
                )
              );
            memberPipelineSource = piplinsid;
             assert.isNotEmpty(memberPipelineSource, 'Member cannot find the pipelineSourcesId');
            return done();
          }
        );
      }
    );

    it('10. Super user should be able to get their pipelinesources',
      function (done) {
         superUserApiAdapter.getPipelineSources('',
           function (err, piplin) {
             if (err)
               return done(
                new Error(
                  util.format('Super user cannot get pipelineSources', err)
                 )
              );
             assert.isNotEmpty(superUserPipelineSource, 'Super user cannot find the pipelineSources');
             return done();
          }
        );
      }
    );

    it('11. Admin should be able to get their pipelinesources',
      function (done) {
         adminApiAdapter.getPipelineSources('',
           function (err, piplins) {
             if (err)
               return done(
                new Error(
                  util.format('Admin user cannot get pipelineSources', err)
                 )
              );
             assert.isNotEmpty(adminUserPipelineSource, 'Admin user cannot find the pipelineSources');
             return done();
          }
        );
      }
    );

    it('12. Member should be able to get their pipelinesources',
      function (done) {
         memberApiAdapter.getPipelineSources('',
           function (err, piplins) {
             if (err)
               return done(
                new Error(
                  util.format('Member cannot get pipelineSources', err)
                 )
              );
             memberPipelineSource = _.first(piplins);
             assert.isNotEmpty(memberPipelineSource, 'Member cannot find the pipelineSources');
             return done();
          }
        );
      }
    );

    it('13. Id field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(superUserPipelineSource.id, 'Id cannot be null');
        assert.equal(typeof(superUserPipelineSource.id), 'number');
        return done();
      }
    );

    it('14. ProjectId field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(superUserPipelineSource.projectId, 'ProjectId cannot be null');
        assert.equal(typeof(superUserPipelineSource.projectId), 'number');
        return done();
      }
    );

    it('15. RepositoryFullName field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.repositoryFullName, 'RepositoryFullName cannot be null');
        assert.equal(typeof(superUserPipelineSource.repositoryFullName), 'string');
        return done();
      }
    );

    it('16. Branch field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.branch, ' Branch cannot be null');
        assert.equal(typeof(superUserPipelineSource.branch), 'string');
        return done();
      }
    );

    it('17. FileFilter field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.fileFilter, 'FileFilter cannot be null');
        assert.equal(typeof(superUserPipelineSource.fileFilter), 'string');
        return done();
      }
    );

    it('18. IntegrationId field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(superUserPipelineSource.integrationId, 'IntegrationId cannot be null');
        assert.equal(typeof(superUserPipelineSource.integrationId), 'number');
        return done();
      }
    );

    it('19. IsSyncing field in pipelineSource API should be a boolean type',
      function (done) {
        assert.isNotNull(superUserPipelineSource.isSyncing, 'IsSyncing cannot be null');
        assert.equal(typeof(superUserPipelineSource.isSyncing), 'boolean');
        return done();
      }
    );

    it('20. LastSyncStatusCode field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(superUserPipelineSource.lastSyncStatusCode, 'LastSyncStatusCode cannot be null');
        assert.equal(typeof(superUserPipelineSource.lastSyncStatusCode), 'number');
        return done();
      }
    );

    it('21. LastSyncStartedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.lastSyncStartedAt, 'PipelineSources cannot be null');
        assert.equal(typeof(superUserPipelineSource.lastSyncStartedAt), 'string');
        return done();
      }
    );

    it('22. LastSyncEndedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.lastSyncEndedAt, 'LastSyncStartedAt cannot be null');
        assert.equal(typeof(superUserPipelineSource.lastSyncEndedAt), 'string');
        return done();
      }
    );

    // it('23. LastSyncLogs field in pipelineSource API should be an object type',
    //   function (done) {
    //     assert.equal(typeof(superUserPipelineSource.lastSyncLogs), 'object');
    //     return done();
    //   }
    // );

    it('24. ResourceId field in pipelineSource API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(superUserPipelineSource.resourceId, 'ResourceId cannot be null');
        assert.equal(typeof(superUserPipelineSource.resourceId), 'number');
        return done();
      }
    );

    // it('25. CreatedBy field in pipelineSource API shouldnot be null and should be a string',
    //    function (done) {
    //   assert.isNotNull(superUserPipelineSource.createdBy, 'CreatedBy cannot be null');
    //       assert.equal(typeof(superUserPipelineSource.createdBy), 'string');
    //       return done();
    //     }
    //   );

    // it('26. UpdatedBy field in pipelineSource API shouldnot be null and should be a string',
    //   function (done) {
    //     assert.isNotNull(superUserPipelineSource.updatedBy, 'UpdatedBy cannot be null');
    //     assert.equal(typeof(superUserPipelineSource.updatedBy), 'string');
    //     return done();
    //   }
    // );

    it('27. CreatedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.createdAt, 'CreatedAt cannot be null');
        assert.equal(typeof(superUserPipelineSource.createdAt), 'string');
        return done();
      }
    );

    it('28. UpdatedAt field in pipelineSource API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(superUserPipelineSource.updatedAt, 'UpdatedAt cannot be null');
        assert.equal(typeof(superUserPipelineSource.updatedAt), 'string');
        return done();
      }
    );

    it('29. Admin should be able to delete pipelineSource by Id',
      function (done) {
         adminApiAdapter.deletePipelineSourcesById(adminUserPipelineSource.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('Admin cannot delete PipelineSources by Id',
                     adminUserPipelineSource.id, err)
                 )
                );

             return done();
           }
         );
       }
    );

    it('30. superUser should be able to delete pipelineSource by Id',
      function (done) {
         superUserApiAdapter.deletePipelineSourcesById(superUserPipelineSource.id,
           function (err, result) {
             if (err || _.isEmpty(result))
               return done(
                 new Error(
                   util.format('superUser cannot delete PipelineSources by Id',
                     superUserPipelineSource.id, err)
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
