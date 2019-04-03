'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_INTEGRATIONS';
var testSuiteDesc = 'Github Organization Integration API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var project = [];
    var integration = [];

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

    it('1. User can add new integration',
      function (done) {
        var body = {
           "masterIntegrationId": 77,
           "name": global.GH_USR_API_INTEGRATION_NAME,
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

        userApiAdapter.postIntegration(body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add integration',
                    util.inspect(err))
                )
              );
              integration = ints;
            return done();
          }
        );
      }
    );

    it('2. User can get their integration',
      function (done) {
        var query = 'projectIds=' + project.id;
        userApiAdapter.getIntegrations(query,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get integration',
                    query, err)
                )
              );
            integration = _.findWhere(ints, {masterIntegrationName: "dockerRegistryLogin"});
            console.log('integration', integration);
            assert.isNotEmpty(ints, 'User cannot find the integration');
            return done();
          }
        );
      }
    );

    it('3. User can get integration by Id',
      function (done) {
        userApiAdapter.getIntegrationById(integration.id,
          function (err, ints) {
            if (err || _.isEmpty(ints))
              return done(
                new Error(
                  util.format('User cannot get integration by Id',
                    integration.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('4. User can update the integration',
      function (done) {
        var body = {
           "name" : global.GH_USR_API_RENAME_INTERGATION
              };
        userApiAdapter.putIntegrationById(integration.id, body,
          function (err, ints) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update integration',
                    util.inspect(err))
                 )
               );
             return done();
           }
         );
       }
     );


    it('4. Id field in integration API shouldnot be null and should be an integer type',
       function (done) {
         assert.isNotNull(integration.id, 'integration Id cannot be null');
         assert.equal(typeof(integration.id), 'number');
         return done();
         }
     );

    it('5. masterintegrationId field in integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(integration.masterIntegrationId, 'master integration Id cannot be null');
        assert.equal(typeof(integration.masterIntegrationId), 'number');
        return done();
      }
    );

    it('6. masterintegrationName field in integration API should be a string type',
      function (done) {
        assert.equal(typeof(integration.masterIntegrationName), 'string');
        return done();
      }
    );

    it('7. masterintegrationType field in integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(integration.masterIntegrationType, 'integration Master Type cannot be null');
        assert.equal(typeof(integration.masterIntegrationType), 'string');
        return done();
      }
    );

    it('8. integrationName field in integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(integration.name, 'integration name cannot be null');
        assert.equal(typeof(integration.name), 'string');
        return done();
      }
    );

    it('9. integrationProjectId field in integration API shouldnot be null and should be a integer type',
      function (done) {
        assert.isNotNull(integration.projectId, 'integration Project Id cannot be null');
        assert.equal(typeof(integration.projectId), 'number');
        return done();
      }
    );

    it('10. integrationProviderId field in integration API should be a integer type',
      function (done) {
        console.log("typeof(integration.ProviderId)", typeof(integration.ProviderId));
        return done();
      }
    );

    it('11.integrationCreatedByUserName field in integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(integration.createdByUserName, 'integration Created By User Name cannot be null');
        assert.equal(typeof(integration.createdByUserName), 'string');
        return done();
      }
    );

    it('12. integrationUpdatedByUserName field in integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(integration.updatedByUserName, 'integration Updated By User Name cannot be null');
        assert.equal(typeof(integration.updatedByUserName),'string');
        return done();
      }
    );

    // it('13.integrationCreatedBy field in integration API shouldnot be null and should be a integer type',
    //   function (done) {
    //     assert.isNotNull(integration.createdBy, 'integration Created By cannot be null');
    //     assert.equal(typeof(integration.createdBy), 'number');
    //     return done();
    //   }
    // );
    //
    // it('14. integrationUpdatedBy field in integration API shouldnot be null and should be a integer type',
    //   function (done) {
    //     assert.isNotNull(integration.updatedBy, 'integration Updated By cannot be null');
    //     assert.equal(typeof(integration.updatedBy),'number');
    //     return done();
    //   }
    // );

    it('15. integrationCreatedAt field in integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(integration.createdAt, 'integration created at cannot be null');
        assert.equal(typeof(integration.createdAt), 'string');
        return done();
      }
    );

    it('16. IntegrationUpdatedAt field in integration API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(integration.updatedAt, 'Integration updated at cannot be null');
        assert.equal(typeof(integration.updatedAt), 'string');
        return done();
      }
    );

    it('17. User can deletes integration by Id',
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
