var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.username){
    res.render('index',{title: "Trash", username: req.session.username, isLogin: true});
  }else{
    res.render('index',{title: "Trash"});
  }
});

module.exports = router;
