const fs = require('fs');

module.exports = path => {
  const babelrc = fs.readFileSync(path);
  const config = JSON.parse(babelrc);
  return config;
};
