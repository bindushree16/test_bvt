'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_PROJECTS';
var testSuiteDesc = 'Github Organization Project API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var ownerApiAdapter = null;
    var project = [];

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

            ownerApiAdapter =
              global.newApiAdapterByToken(global.SHIPPABLE_API_TOKEN);

            return done();

          }
        );
      }
    );

    it('1. Owner can add new project',
      function (done) {
        var body = {
          "name": global.GH_OWN_PROJECT_API_NAME,
          "providerId": 1,
          "sourceId": global.GH_OWN_PROJECT_API_SOURCE_ID
        };
        ownerApiAdapter.postProject(body,
          function (err, prj) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot add project',
                    util.inspect(err))
                )
              );
            project = prj;
            return done();
          }
        );
      }
    );

    it('2. Owner can get project by Id',
      function (done) {
        ownerApiAdapter.getProjectById(project.id,
          function (err, prj) {
            if (err || _.isEmpty(prj))
              return done(
                new Error(
                  util.format('User cannot get project by Id',
                    project.id, err)
                )
              );

            return done();
          }
        );
      }
    );

    it('3. Owner can update the project',
      function (done) {
        var body = {
          "name": global.GH_OWN_PROJECT_API_PROJECT_RENAME
        };
        ownerApiAdapter.putProjectById(project.id, body,
          function (err, prj) {
            if (err)
              return done(
                new Error(
                  util.format('User cannot update project',
                    util.inspect(err))
                )
              );
            
            return done();
          }
        );
      }
    );

    it('4. Owner can get projects',
      function (done) {
        ownerApiAdapter.getProjects('',
          function (err, prjs) {
            if (err || _.isEmpty(prjs))
              return done(
                new Error(
                  util.format('User cannot get project',
                    query, err)
                )
              );
            project = _.findWhere(prjs, {name: global.GH_OWN_PROJECT_API_PROJECT_RENAME});

            return done();
          }
        );
      }
    );

    it('5. Id field in project API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(project.id, 'Project Id field cannot be null');
        assert.equal(typeof(project.id), 'number');
        return done();
      }
    );

    it('6. IsOrphaned field in project API should be a boolean type',
      function (done) {
        assert.equal(typeof(project.isOrphaned), 'boolean');
        return done();
      }
    );

    it('7. Name field in project API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(project.name, 'Project name field cannot be null');
        assert.equal(typeof(project.name), 'string');
        return done();
      }
    );

     it('8. SystemPropertyBag field in project API should be an object type',
       function (done) {
         assert.equal(typeof(project.systemPropertyBag), 'object');
         return done();
       }
     );

    it('9. ProviderId field in project API shouldnot be null and should be an integer type',
      function (done) {
        assert.isNotNull(project.providerId, 'Project provider Id field cannot be null');
        assert.equal(typeof(project.providerId), 'number');
        return done();
      }
    );

    it('10. SourceId field in project API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(project.sourceId, 'Project source Id field cannot be null');
        assert.equal(typeof(project.sourceId), 'string');
        return done();
      }
    );

    it('11. CreatedBy field in project API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(project.createdBy, 'Project created by field cannot be null');
        assert.equal(typeof(project.createdBy), 'string');
        return done();
      }
    );

    it('12. UpdatedBy field in project API shouldnot be null and should be a string type',
      function (done) {
        assert.isNotNull(project.updatedBy, 'Project updated by field cannot be null');
        assert.equal(typeof(project.updatedBy), 'string');
        return done();
      }
    );

    it('13. CreatedAt field in project API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(project.createdAt, 'Project created at field cannot be null');
        assert.equal(typeof(project.createdAt), 'string');
        return done();
      }
    );

    it('14. UpdatedAt field in project API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(project.updatedAt, 'Project updated at field cannot be null');
        assert.equal(typeof(project.updatedAt), 'string');
        return done();
      }
    );

    after(
      function (done) {
        return done();
      }
    );
  }
);
