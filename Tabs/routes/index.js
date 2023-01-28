var express = require('express');
var path = require('path');
var router = express.Router();


router.get('/*.html', function(req, res) {
  res.sendFile(path.join(req.app.get('root'), 'public', 'html', req.path));
});

router.get('/*.js', function(req, res) {
  res.sendFile(path.join(req.app.get('root'), 'public', 'javascripts', req.path));
});

router.get('/*.css', function(req, res) {
  res.sendFile(path.join(req.app.get('root'), 'public', 'stylesheets', req.path));
});

router.get('/', function(req, res, next) {
  res.sendFile(path.join(req.app.get('root'), 'public', 'html', 'index.html'));
});

module.exports = router;
