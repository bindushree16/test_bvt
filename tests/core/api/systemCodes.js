'use strict';

var testSetup = require('../../../testSetup.js');

var testSuite = 'API_systemCodes';
var testSuiteDesc = 'Github Organization systemCodes API tests';
var test = util.format('%s - %s', testSuite, testSuiteDesc);

describe(test,
  function () {
    var publicUserApiAdapter = null;
    var systemCodes = [];

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

            publicUserApiAdapter =
              global.newApiAdapterByToken();

            return done();

          }
        );
      }
    );

    it('1. Public user can get their systemcodes',
      function (done) {
        publicUserApiAdapter.getSystemCodes('',
          function (err, codes) {
            if (err)
              return done(
                new Error(
                  util.format('public user cannot get systemcodes',
                    query, err)
                )
              );
            systemCodes = _.first(codes);


            assert.isNotEmpty(codes, 'public user cannot find the codes');
            return done();
          }
        );
      }
    );

    it('2. Code field in systemcodes API shouldnot be null and should be a number',
      function (done) {
        assert.isNotNull(systemCodes.code, 'systemCodes code field cannot be null');
        assert.equal(typeof(systemCodes.code), 'number');
        return done();
      }
    );

    it('3. Name field in systemcodes API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(systemCodes.name, 'systemCodes name field cannot be null');
        assert.equal(typeof(systemCodes.name), 'string');
        return done();
      }
    );

    it('4. Group field in systemcodes API shouldnot be null and should be a string ',
      function (done) {
        assert.isNotNull(systemCodes.group, 'systemCodes group field cannot be null');
        assert.equal(typeof(systemCodes.group), 'string');
        return done();
      }
    );

    it('5. CreatedAt field in systemcodes API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(systemCodes.createdAt, 'systemCodes created at field cannot be null');
        assert.equal(typeof(systemCodes.createdAt), 'string');
        return done();
      }
    );

    it('6. UpdatedAt field in systemcodes API shouldnot be null and should be a string',
      function (done) {
        assert.isNotNull(systemCodes.updatedAt, 'Systemcodes updated at field cannot be null');
        assert.equal(typeof(systemCodes.updatedAt), 'string');
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
