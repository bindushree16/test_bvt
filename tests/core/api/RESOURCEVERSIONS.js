'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_RESOURCE_VERSIONS';
var testSuiteDesc = 'Github Organization Resource Version API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var userApiAdapter = null;
    var project = [];
    var pipelineSource = [];
    var integration = [];
    var dockerIntegration = [];
    var resource = [];
    var resourceVersion = [];

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
         "name": global.GH_USR_API_PIPELINE_INTEGRATION_NAME,
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

    it('3. User posts docker registry integration to add resources',
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
               "value": "Qhode12345"
            },
            {
               "label": "url",
               "value": "https://index.docker.io/v1/"
            },
            {
               "label": "username",
               "value": "testDoc"
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
            dockerIntegration = ints;
            return done();
          }
        );
      }
    );
  
    it('4. User posts PipelineSources',
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

    it('5. User creates new image resource',
      function (done) {
        var body = {
          "staticPropertyBag": {
            "imageName": "shippabledocker/sample_python"
          },
          "name": "docker-pytimage",
          "integrationId": dockerIntegration.id,
          "typeCode": 1001,
          "projectId": project.id,
          "pipelineSourceId": pipelineSource.id
        };
        userApiAdapter.postResource(body,
          function (err, res) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot post resources',
                    util.inspect(err))
                )
              );
            resource = res;
            return done();
          }
        );
      }
    );
        
    it('6. User can post resource versions',
      function (done) {
        var body = {
          "contentPropertyBag": {
            "imageTag": "latest1"
          },
          "projectId": project.id,
          "resourceId": resource.id          
        };
        userApiAdapter.postResourceVersion(body,
          function (err, resVer) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add resource version',
                    util.inspect(err))
                )
              );
            resourceVersion = resVer;
            return done();
          }
        );
      }
    );
  
    it('7. User can get resource version by Id',
      function (done) {
        userApiAdapter.getResourceVersionById(resourceVersion.id,
          function (err, resVer) {
            if (err || _.isEmpty(resVer))
              return done(
                new Error(
                  util.format('User cannot get resource version by Id',
                    resourceVersion.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('8. User can get their resource versions',
      function (done) {
        userApiAdapter.getResourceVersions('',
          function (err, resVers) {
            if (err || _.isEmpty(resVers))
              return done(
                new Error(
                  util.format('User cannot get resource versions',
                    query, err)
                )
              );
            resourceVersion = _.first(resVers);
            return done();
          }
        );
      }
    );
  
    it('9. Id field in resource version API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(resourceVersion.id, 'Resource version Id field cannot be null');
        assert.equal(typeof(resourceVersion.id), 'number');
        return done();
      }
    );

    it('10. ProjectId field in resource version API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(resourceVersion.projectId, 'Project Id field cannot be null');
        assert.equal(typeof(resourceVersion.projectId), 'number');
        return done();
      }
    );

    it('11. ResourceId field in resource version API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(resourceVersion.resourceId, 'Resource Id field cannot be null');
        assert.equal(typeof(resourceVersion.resourceId), 'number');
        return done();
      }
    );
  
    it('12. ContentPropertyBag field in resource version API should be an object type',
      function (done) {
        assert.equal(typeof(resourceVersion.contentPropertyBag), 'object'); 
        return done();
      }
    );
  
    it('13. CreatedByStepId field in resource version API should be an object type',
      function (done) {
        assert.equal(typeof(resourceVersion.createdByStepId), 'object'); 
        return done();
      }
    );
  
    it('14. CreatedAt field in resource version API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(resourceVersion.createdAt, 'Created At field cannot be null');
        assert.equal(typeof(resourceVersion.createdAt), 'string'); 
        return done();
      }
    );
  
    it('15. UpdatedAt field in resource version API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(resourceVersion.updatedAt, 'Updated At field cannot be null');
        assert.equal(typeof(resourceVersion.updatedAt), 'string'); 
        return done();
      }
    );
  
    it('16.  User can delete resource version by Id',
      function (done) {
        userApiAdapter.deleteResourceVersionById(resourceVersion.id,
          function (err, res) {
            if (err || _.isEmpty(res))
              return done(
                new Error(
                  util.format('User cannot delete resource version by Id',
                    pipeline.id, err)
                )
              );
            return done();
          }
        );
      }
    );
  
    it('17.  User can delete resource version by resource Id',
      function (done) {
         userApiAdapter.deleteResourceVersionByResourceId(resource.id,
           function (err, res) {
             if (err || _.isEmpty(res))
               return done(
                 new Error(
                   util.format('User cannot delete resource version by resource Id',
                     pipeline.id, err)
                 )
                );

             return done();
           }
         );
       }
    );
  
    it('18. User can delete pipelineSource by Id',
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
  
    it('19. User can delete integrations by Id',
      function (done) {
        var intIds = [integration.id, dockerIntegration.id];
        async.each(intIds,
          function (intId, nextIntId) {
            var json = intId;
            userApiAdapter.deleteIntegrationById(json,
              function (err, res) {
                if (err)
                  return nextIntId(
                    new Error(
                      util.format('User cannot delete the integration with id:%s %s',
                        intId, util.inspect(response))
                    )
                  );
                  return nextIntId();
                }
              );
            },
          function (err) {
            return done(err);
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