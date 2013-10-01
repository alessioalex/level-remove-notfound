# level-remove-notfound

In case you don't want level.get(key) to return an error in case key doesn't exist. https://github.com/rvagg/node-levelup#dbgetkey-options-callback

[![build status] (https://secure.travis-ci.org/alessioalex/level-remove-notfound.png)] (http://travis-ci.org/alessioalex/level-remove-notfound)

## Example

```js
var level  = require('level'),
    assert = require('assert'),
    get    = require('level-remove-notfound'),
    db;

db = get.install(level('/tmp/' + Date.now() + '.db'));

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
```

## API

### get(db, key, [levelUpOptions], cb)

Get a value in `db` without receiving `notFoundError` in case that value doesn't exist.

### get.install(db)
### db#get(key, [levelUpOptions], cb)

Install `level-remove-notfound` onto the `db`.

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install level-remove-notfound
```

## License

MIT
