'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_resources';
var testSuiteDesc = 'Github Organization resources API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var project = {};
    var integration = {};
    var pipelineSource = {};
    var resource = {};

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

    it('2. User can post their integration',
      function (done) {
        var body = {
         "masterIntegrationId": 20,
         "masterIntegrationName": "github",
         "name": 'github3',
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

    it('3. User can post PipelineSources',
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
    it('4. User can post resources',
      function (done) {
        var body = {
          "name": "version95",
          "integrationId": integration.id,
          "projectId": project.id,
          "typeCode": 1000,
          "pipelineSourceId": pipelineSource.id,
          "staticPropertyBag": {
          	"repoPath": global.GH_USERNAME + '/' +
              global.GH_PROJECT_NAME
          }
        };
        userApiAdapter.postResource(body,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot post resources',
                    util.inspect(err))
                )
              );
            resource = result;
            return done();
          }
        );
      }
    );

    it('5. User can get resources by Id',
      function (done) {
        userApiAdapter.getResourceById(resource.id,
          function (err, result) {
            if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot get resources by Id',
                    resource.id, err)
                )
              );
            return done();
          }
        );
      }
    );

    it('6. User can put the resources',
      function (done) {
        var body = {
          "isConsistent": true
        };
        userApiAdapter.putResourceById(resource.id, body,
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot put resources',
                    util.inspect(err))
                )
              );
            return done();
          }
        );
      }
    );

    it('7. User can get their resources',
      function (done) {
        userApiAdapter.getResources('',
          function (err, result) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot get resources',
                    query, err)
                )
              );
             resource = _.first(result);

            assert.isNotEmpty(result, 'User cannot find the resources');
            return done();
          }
        );
      }
    );

    it('8.id field in resources API shouldnot be null and should be a integer',
      function (done) {
        assert.isNotNull(resource.id, 'resources id field cannot be null');
        assert.equal(typeof(resource.id), 'number');
        return done();
      }
    );

    it('9.name field in resources API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(resource.name, ' resources name field cannot be null');
        assert.equal(typeof(resource.name), 'string');
        return done();
      }
    );

    it('10. integrationId field in resources API should be a integer',
      function (done) {
        assert.equal(typeof(resource.integrationId), 'number');
        return done();
      }
    );
    
    // it('11. configPropertyBag field in resources API should be a string',
    //   function (done) {
    //     assert.equal(typeof(resource.configPropertyBag), 'undefined');
    //     return done();
    //   }
    // );

    it('12. systemPropertyBag field in resources API should be a string',
      function (done) {
        assert.equal(typeof(resource.systemPropertyBag), 'object');
        return done();
      }
    );

    it('13. staticPropertyBag field in resources API should be a string',
      function (done) {
        assert.equal(typeof(resource.staticPropertyBag), 'object');
        return done();
      }
    );

    it('14. typeCode field in resources API should be a integer',
      function (done) {
        assert.isNotNull(resource.typeCode,
          'resource typeCode field cannot be null');
        assert.equal(typeof(resource.typeCode), 'number');
        return done();
      }
    );

    it('15.latestResourceVersionId field in resources API should be a integer',
      function (done) {
        assert.equal(typeof(resource.latestResourceVersionId), 'object');
        return done();
      }
    );

    it('16. ProjectId field in resources API shouldnot' +
      'be null and should be a number',
      function (done) {
        assert.isNotNull(resource.projectId,
          'resource ProjectId field cannot be null');
        assert.equal(typeof(resource.projectId), 'number');
        return done();
      }
    );

    it('17. PipelineSourceId field in resources API should be a integer',
      function (done) {
        assert.equal(typeof(resource.pipelineSourceId), 'number');
        return done();
      }
    );

    it('18. IsDeleted field in resources API shouldnot be null and should be' +
      'a boolean',
      function (done) {
        assert.isNotNull(resource.isDeleted,
          'resources isDeleted field cannot be null');
        assert.equal(typeof(resource.isDeleted), 'boolean');
        return done();
      }
    );

    it('19. IsConsistent field in resources API shouldnot be' +
       'null and should be a boolean',
      function (done) {
        assert.isNotNull(resource.isConsistent,
          'resources isConsistent field cannot be null');
        assert.equal(typeof(resource.isConsistent), 'boolean');
        return done();
      }
    );

    it('20. IsInternal field in resources API' +
      'shouldnot be null and should be a boolean',
      function (done) {
        assert.isNotNull(resource.isInternal,
          'resources isInternal field cannot be null');
        assert.equal(typeof(resource.isInternal), 'boolean');
        return done();
      }
    );

   it('21. yml field in resources',
     function (done) {
       assert.equal(typeof(resource.yml), 'object');
       return done();
     }
   );

    it('22. createdAt field in resources API' +
      'shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(resource.createdAt,
          'resources updated at field cannot be null');
        assert.equal(typeof(resource.createdAt), 'string');
        return done();
      }
    );

    it('23. UpdatedAt field in resources API' +
      'shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(resource.updatedAt,
          'resources updated at field cannot be null');
        assert.equal(typeof(resource.updatedAt), 'string');
        return done();
      }
    );

    it('24. User can delete resource by Id',
      function (done) {
        userApiAdapter.deleteResourceById(resource.id,
          function (err, result) {
            if (err || _.isEmpty(result))
              return done(
                new Error(
                  util.format('User cannot delete resource by Id',
                    resource.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('25.  User can delete pipelineSource by Id',
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

    it('26. User can deletes integration by Id',
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
