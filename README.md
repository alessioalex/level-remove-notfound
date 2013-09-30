# level-remove-notfound

In case you don't want level.get(key) to return an error in case key doesn't exist. https://github.com/rvagg/node-levelup#dbgetkey-options-callback

## Example

```js
var level  = require('level'),
    assert = require('assert'),
    removeNotFound = require('level-remove-notfound'),
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
```

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install level-remove-notfound
```

## License

MIT
