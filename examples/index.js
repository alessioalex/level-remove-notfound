var level  = require('level'),
    assert = require('assert'),
    removeNotFound = require('../'),
    db;

db = removeNotFound(level('/tmp/' + Date.now() + '.db'));

db.get('foo', function(err, val) {
  assert.equal(err, null, 'error should be null');
  assert.equal(val, null, 'val should be null');

  db.put('foo', 'bar', function(err) {
    if (err) { throw err; }

    db.get('foo', function(err, val) {
      assert.equal(err, null, 'error should be null');
      assert.equal(val, 'bar', 'val === "bar"');
    });
  });
});
