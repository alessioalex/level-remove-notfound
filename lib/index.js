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

function install(db) {
  var originalGet = db.get;

  db.get = function(key, options, callback) {
    if (isFn(options)) {
      callback = wrapCallback(options);
      options = {};
    } else if (isFn(callback)) {
      callback = wrapCallback(callback);
    }

    callback = wrapCallback(callback);
    originalGet.call(db, key, options, callback);
  };

  return db;
}

module.exports = {
  isFn         : isFn,
  wrapCallback : wrapCallback,
  install      : install
};
