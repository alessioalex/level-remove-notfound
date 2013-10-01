var level  = require('level'),
    async  = require('async'),
    should = require('should'),
    fs     = require('fs'),
    lib    = require('../lib/index'),
    db;

describe('level-remove-notfound', function() {
  describe('#isFn', function() {

    it('should detect function', function() {
      var noop = function() {};

      lib.isFn(noop).should.be.true;
    });

    it('should return false for other types', function() {
      obj  = { a: 1 };
      str  = 'abc';

      lib.isFn(obj).should.be.false;
      lib.isFn(str).should.be.false;
    });

  });

  describe('#wrapCallback', function() {
    it('should should not call with err.notFound', function() {
      var cb, wrapper, errNotFound;

      cb = function(err, val) {
        if (err) {
          err.should.not.have.property('notFound');
        } else {
          should.not.exist(err);
          should.not.exist(val);
        }
      };

      wrapper = lib.wrapCallback(cb);
      errNotFound = new Error('notFoundError');
      errNotFound.notFound = 1;

      wrapper(new Error('test'));
      wrapper(errNotFound);
    });

    it('should call with value', function() {
      var cb, wrapper;

      cb = function(err, val) {
        should.not.exist(err);
        should.exist(val);
      };

      wrapper = lib.wrapCallback(cb);

      wrapper(null, '1');

      (function() {
        wrapper('1', '2');
      }).should.throw();
    });
  });

  describe('#get', function() {
    var dbPath, db, key;

    before(function(done) {
      dbPath = '/tmp/' + Date.now() + '.db';
      db     = level(dbPath);
      key    = 'testkey';
      done();
    });

    after(function(done) {
      db.close(function(err) {
        try {
          fs.unlinkSync(dbPath);
        }
        catch(err) { }
        done();
      });
    });

    it("should return notFound with native get", function(done) {
      db.get(Date.now() + Date.now(), function(err, val) {
        err.should.be.an.Error;
        err.should.have.property('notFound');
        done();
      });
    });

    it("should not return notFound with #get", function(done) {
      lib.get(db, Date.now() + Date.now(), function(err, val) {
        should.not.exist(err);
        should.not.exist(val);
        done();
      });
    });
  });

  describe('#get.install', function() {
    var dbPath, db, key;

    before(function(done) {
      dbPath = '/tmp/' + Date.now() + '.db';
      db     = lib.install(level(dbPath));
      key    = 'testkey';
      done();
    });

    after(function(done) {
      db.close(function(err) {
        try {
          fs.unlinkSync(dbPath);
        }
        catch(err) { }
        done();
      });
    });

    it('should not throw error when key not found', function(done) {
      db.get(key, function(err, val) {
        should.not.exist(err);
        should.not.exist(val);
        done();
      });
    });

    it('should get key with proper encoding (options arg)', function(done) {
      async.series([
        function(cb) {
          db.put(key, { a: 1, b: 2 }, { valueEncoding: 'json' }, cb);
        },
        function(cb) {
          db.get(key, { valueEncoding: 'json' }, cb);
        },
        function(cb) {
          db.del(key, cb);
        },
        function(cb) {
          db.get(key, cb);
        }
      ], function(err, results) {
        if (err) { throw err; }

        results[1].should.have.property('a');
        results[1].should.have.property('b');
        should.not.exist(results[3]);

        done();
      });
    });

  });
});
