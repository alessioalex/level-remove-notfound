function isFn(fn) {
  return (typeof fn === 'function');
}

function wrapCallback(callback) {
  return function(err, value) {
    if (err && err.notFound) {
      callback(null, null);
    } else {
      callback(err, value);
    }
  };
}

function get(db, key, options, callback) {
  return _get(db.get, db, key, options, callback);
}

// ### get(db, key, [levelUpOptions], cb)
function _get(originalGet, db, key, options, callback) {
  if (isFn(options)) {
    callback = wrapCallback(options);
    options = {};
  } else if (isFn(callback)) {
    callback = wrapCallback(callback);
  }

  callback = wrapCallback(callback);
  originalGet.call(db, key, options, callback);
}

function install(db) {
  var originalGet = db.get;

  db.get = function(key, options, cb) {
    return _get(originalGet, db, key, options, cb);
  };

  return db;
}

module.exports = {
  isFn         : isFn,
  wrapCallback : wrapCallback,
  install      : install,
  get          : get
};
