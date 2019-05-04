'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_PROJECTINTEGRATIONS';
var testSuiteDesc = 'Github Organization Project Integration API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var superUserApiAdapter = null;
    var adminApiAdapter = null;
    var memberApiAdapter = null;
    var project = [];
    var projectIntegration = [];
    var adminProjectIntegration = [];

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

          superUserApiAdapter =
            global.newApiAdapterByToken(global.SHIPPABLE_SUPERUSER_API_TOKEN);
          adminApiAdapter =
            global.newApiAdapterByToken(global.SHIPPABLE_ADMIN_API_TOKEN);
          memberApiAdapter =
            global.newApiAdapterByToken(global.SHIPPABLE_MEMBER_API_TOKEN);
              superUserApiAdapter.getProjects('',
                function(err, prjs) {
                  if (err || _.isEmpty(prjs))
                    return done(
                      new Error(
                        util.format('Project list is empty',err)
                      )
                    );
                  project = _.first(prjs);
                  return done();
                }
              );
          }
        );
      }
    );

    it('1. SuperUser can add new project Integration',
      function (done) {
        var body = {
           "masterIntegrationId": 77,
           "name": global.GH_API_PROJECTINTEGRATION_NAME_SUPERUSER,
           "projectId": project.id,
           "formJSONValues": [
                   {
                       "label": "email",
                       "value": "shptest@shippable.com"
                   },
                   {
                       "label": "password",
                       "value": "Qhode1234"
                   },
                   {
                       "label": "url",
                       "value": "https://index.docker.io/v1/"
                   },
                   {
                       "label": "username",
                       "value": "shippabledocker"
                   }
                 ]
               };

        superUserApiAdapter.postProjectIntegration(body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('SuperUser cannot add project integration',
                    util.inspect(err))
                )
              );
              projectIntegration = ints;
            return done();
          }
        );
      }
    );

    it('2. Admin can add new project Integration',
      function (done) {
        var body = {
           "masterIntegrationId": 77,
           "name": global.GH_API_PROJECTINTEGRATION_NAME_ADMIN,
           "projectId": project.id,
           "formJSONValues": [
                   {
                       "label": "email",
                       "value": "shptest@shippable.com"
                   },
                   {
                       "label": "password",
                       "value": "Qhode1234"
                   },
                   {
                       "label": "url",
                       "value": "https://index.docker.io/v1/"
                   },
                   {
                       "label": "username",
                       "value": "shippabledocker"
                   }
                 ]
               };

        adminApiAdapter.postProjectIntegration(body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('Admin cannot add project integration',
                    util.inspect(err))
                )
              );
              adminProjectIntegration = ints;
            return done();
          }
        );
      }
    );

    it('3. SuperUser can get their project integration',
      function (done) {
        var query = 'projectIds=' + project.id;
        superUserApiAdapter.getProjectIntegrations(query,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('SuperUser cannot get project integration',
                    query, err)
                )
              );
            projectIntegration = _.findWhere(ints, {masterIntegrationName: "dockerRegistryLogin"});
            assert.isNotEmpty(ints, 'SuperUser cannot find the project integration');
            return done();
          }
        );
      }
    );

    it('4. Admin can get their project integration',
      function (done) {
        var query = 'projectIds=' + project.id;
        adminApiAdapter.getProjectIntegrations(query,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('Admin cannot get project integration',
                    query, err)
                )
              );
            projectIntegration = _.findWhere(ints, {masterIntegrationName: "dockerRegistryLogin"});
            assert.isNotEmpty(ints, 'Admin cannot find the project integration');
            return done();
          }
        );
      }
    );

    it('5. Member can get their project integration',
      function (done) {
        var query = 'projectIds=' + project.id;
        memberApiAdapter.getProjectIntegrations(query,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('Member cannot get project integration',
                    query, err)
                )
              );
            projectIntegration = _.findWhere(ints, {masterIntegrationName: "dockerRegistryLogin"});
            assert.isNotEmpty(ints, 'Member cannot find the project integration');
            return done();
          }
        );
      }
    );

    it('6. SuperUser can get project integration by Id',
      function (done) {
        superUserApiAdapter.getProjectIntegrationById(projectIntegration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('SuperUser cannot get project integration by Id',
                    projectIntegration.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    // it('7. Admin can get project integration by Id',
    //   function (done) {
    //     adminApiAdapter.getProjectIntegrationById(adminProjectIntegration.id,
    //       function (err, ints) {
    //         if (err || _.isEmpty(ints))
    //           return done(
    //             new Error(
    //               util.format('Admin cannot get project integration by Id',
    //                 adminProjectIntegration.id, err)
    //             )
    //           );
    //         return done();
    //       }
    //     );
    //   }
    // ); commenting, since till we fix https://github.com/Shippable/heap/issues/2958
    //
    // it('8. Member can get project integration by Id',
    //   function (done) {
    //     memberApiAdapter.getProjectIntegrationById(projectIntegration.id,
    //       function (err, ints) {
    //         if (err || _.isEmpty(ints))
    //           return done(
    //             new Error(
    //               util.format('Member cannot get project integration by Id',
    //                 projectIntegration.id, err)
    //             )
    //           );
    //         return done();
    //       }
    //     );
    //   }
    // );

    it('9. SuperUser can update the project integration',
      function (done) {
        var body = {
           "name" : global.GH_USR_API_RENAME_PROJECTINTERGATION
              };
        superUserApiAdapter.putProjectIntegrationById(projectIntegration.id, body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('SuperUser cannot update project integration',
                    util.inspect(err))
                )
              );
            return done();
          }
        );
      }
    );

    // it('10. Admin can update the project integration',
    //   function (done) {
    //     var body = {
    //       "name" : global.GH_USR_API_RENAME_PROJECTINTERGATION
    //          };
    //    adminApiAdapter.putProjectIntegrationById(adminProjectIntegration.id, body,
    //      function (err, ints) {
    //        if (err)
    //          return done(
    //            new Error(
    //              util.format('Admin cannot update project integration',
    //                util.inspect(err))
    //             )
    //           );
    //         return done();
    //       }
    //     );
    //   }
    // );

    it('11. Id field in project integration API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(projectIntegration.id, 'project integration Id cannot be null');
        assert.equal(typeof(projectIntegration.id), 'number');
        return done();
      }
    );

    it('12. masterintegrationId field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.masterIntegrationId, 'master project integration Id cannot be null');
        assert.equal(typeof(projectIntegration.masterIntegrationId), 'number');
        return done();
      }
    );

    it('13. masterintegrationName field in project integration API should be a string type',
      function (done) {
        assert.equal(typeof(projectIntegration.masterIntegrationName), 'string');
        return done();
      }
    );

    it('14. masterintegrationType field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.masterIntegrationType, 'project integration Master Type cannot be null');
        assert.equal(typeof(projectIntegration.masterIntegrationType), 'string');
        return done();
      }
    );

    it('15. Name field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.name, 'project integration name cannot be null');
        assert.equal(typeof(projectIntegration.name), 'string');
        return done();
      }
    );

    it('16. ProjectId field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.projectId, 'project integration Project Id cannot be null');
        assert.equal(typeof(projectIntegration.projectId), 'number');
        return done();
      }
    );

    // it('17. ProviderId field in project integration API should be a integer type',
    //   function (done) {
    //     console.log("typeof(projectIntegration.ProviderId)", typeof(projectIntegration.ProviderId));
    //     return done();
    //   }
    // ); commenting since type is undefined as of now. Will uncomment once it is fixed

    it('18. CreatedByUserName field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.createdByUserName, 'project integration Created By User Name cannot be null');
        assert.equal(typeof(projectIntegration.createdByUserName), 'string');
        return done();
      }
    );

    it('19. UpdatedByUserName field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.updatedByUserName, 'project integration Updated By User Name cannot be null');
        assert.equal(typeof(projectIntegration.updatedByUserName),'string');
        return done();
      }
    );

    it('20. CreatedBy field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.createdBy, 'project integration Created By cannot be null');
        assert.equal(typeof(projectIntegration.createdBy), 'number');
        return done();
      }
    );

    it('21. UpdatedBy field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.updatedBy, 'project integration Updated By cannot be null');
        assert.equal(typeof(projectIntegration.updatedBy),'number');
        return done();
      }
    );

    it('22. CreatedAt field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.createdAt, 'project integration created at cannot be null');
        assert.equal(typeof(projectIntegration.createdAt), 'string');
        return done();
      }
    );

    it('23. UpdatedAt field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.updatedAt, 'project Integration updated at cannot be null');
        assert.equal(typeof(projectIntegration.updatedAt), 'string');
        return done();
      }
    );

    it('24. SuperUser can deletes project integration by Id',
      function (done) {
        superUserApiAdapter.deleteProjectIntegrationById(projectIntegration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('SuperUser cannot delete project integration by Id',
                    projectIntegration.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('25. Admin can deletes project integration by Id',
      function (done) {

        adminApiAdapter.deleteProjectIntegrationById(adminProjectIntegration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('Admin cannot delete project integration by Id',
                    adminProjectIntegration.id, err)
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
