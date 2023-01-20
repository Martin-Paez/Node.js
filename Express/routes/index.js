var express = require('express');
var path = require('path');
//const glob = require('glob');

const fs = require('fs');
const e = require('express');

var router = express.Router();

function recurSearch(dir, fileName) {
  let file = null;
  fs.readdirSync(dir).every(f => {
      let current = path.join(dir, f);
      if (fs.statSync(current).isDirectory())
          file = recurSearch(current, fileName);
      else
          if (f === fileName) {
              file = current;
              return;
          }
  });
  return file;
};

router.get('/', function(req, res, next) {
  if (fs.existsSync(path.join(req.app.settings.views, 'index.jade')))
    res.render('index', { title: 'Express' });  
  else
    next();
});

router.get('/', function(req, res, next) {
  const publicDir = path.join(req.app.settings.public);
  const indexHtml = recurSearch(publicDir, 'index.html');
  if (indexHtml !== null)
    res.sendFile(indexHtml);
  else
    next();
});

module.exports = router;
