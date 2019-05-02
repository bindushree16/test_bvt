'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_PROJECTINTEGRATIONS';
var testSuiteDesc = 'Github Organization Project Integration API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var project = [];
    var projectIntegration = [];

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
              userApiAdapter.getProjects('',
                function(err, prjs) {
                  if (err || _.isEmpty(prjs))
                    return done(
                      new Error(
                        util.format('Project list is empty',
                          query, err)
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

    it('1. User can add new project Integration',
      function (done) {
        var body = {
           "masterIntegrationId": 77,
           "name": global.GH_USR_API_PROJECTINTEGRATION_NAME,
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

        userApiAdapter.postProjectIntegration(body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add project integration',
                    util.inspect(err))
                )
              );
              projectIntegration = ints;
            return done();
          }
        );
      }
    );

    it('2. User can get their project integration',
      function (done) {
        var query = 'projectIds=' + project.id;
        userApiAdapter.getProjectIntegrations(query,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get project integration',
                    query, err)
                )
              );
            projectIntegration = _.findWhere(ints, {masterIntegrationName: "dockerRegistryLogin"});
            assert.isNotEmpty(ints, 'User cannot find the project integration');
            return done();
          }
        );
      }
    );

    it('3. User can get project integration by Id',
      function (done) {
        userApiAdapter.getProjectIntegrationById(projectIntegration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('User cannot get project integration by Id',
                    projectIntegration.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('4. User can update the project integration',
      function (done) {
        var body = {
           "name" : global.GH_USR_API_RENAME_PROJECTINTERGATION
              };
        userApiAdapter.putProjectIntegrationById(projectIntegration.id, body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update project integration',
                    util.inspect(err))
                 )
               );
             return done();
           }
         );
       }
     );


    it('4. Id field in project integration API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(projectIntegration.id, 'project integration Id cannot be null');
        assert.equal(typeof(projectIntegration.id), 'number');
        return done();
      }
    );

    it('5. masterintegrationId field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.masterIntegrationId, 'master project integration Id cannot be null');
        assert.equal(typeof(projectIntegration.masterIntegrationId), 'number');
        return done();
      }
    );

    it('6. masterintegrationName field in project integration API should be a string type',
      function (done) {
        assert.equal(typeof(projectIntegration.masterIntegrationName), 'string');
        return done();
      }
    );

    it('7. masterintegrationType field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.masterIntegrationType, 'project integration Master Type cannot be null');
        assert.equal(typeof(projectIntegration.masterIntegrationType), 'string');
        return done();
      }
    );

    it('8. Name field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.name, 'project integration name cannot be null');
        assert.equal(typeof(projectIntegration.name), 'string');
        return done();
      }
    );

    it('9. ProjectId field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.projectId, 'project integration Project Id cannot be null');
        assert.equal(typeof(projectIntegration.projectId), 'number');
        return done();
      }
    );

    // it('10. ProviderId field in project integration API should be a integer type',
    //   function (done) {
    //     console.log("typeof(projectIntegration.ProviderId)", typeof(projectIntegration.ProviderId));
    //     return done();
    //   }
    // ); commenting since type is undefined as of now. Will uncomment once it is fixed

    it('11. CreatedByUserName field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.createdByUserName, 'project integration Created By User Name cannot be null');
        assert.equal(typeof(projectIntegration.createdByUserName), 'string');
        return done();
      }
    );

    it('12. UpdatedByUserName field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.updatedByUserName, 'project integration Updated By User Name cannot be null');
        assert.equal(typeof(projectIntegration.updatedByUserName),'string');
        return done();
      }
    );

    it('13. CreatedBy field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.createdBy, 'project integration Created By cannot be null');
        assert.equal(typeof(projectIntegration.createdBy), 'number');
        return done();
      }
    );

    it('14. UpdatedBy field in project integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(projectIntegration.updatedBy, 'project integration Updated By cannot be null');
        assert.equal(typeof(projectIntegration.updatedBy),'number');
        return done();
      }
    ); 

    it('15. CreatedAt field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.createdAt, 'project integration created at cannot be null');
        assert.equal(typeof(projectIntegration.createdAt), 'string');
        return done();
      }
    );

    it('16. UpdatedAt field in project integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(projectIntegration.updatedAt, 'project Integration updated at cannot be null');
        assert.equal(typeof(projectIntegration.updatedAt), 'string');
        return done();
      }
    );

    it('17. User can deletes project integration by Id',
      function (done) {
        userApiAdapter.deleteProjectIntegrationById(projectIntegration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('User cannot delete project integration by Id',
                    projectIntegration.id, err)
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
