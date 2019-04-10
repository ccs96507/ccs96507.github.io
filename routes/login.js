var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../users_model.js');

router.get('/', function(req, res, next) {
    res.render('login', {title: "Login Page"});
});

router.post("/", (req, res)=>{
    mongoose.connect('mongodb+srv://trashnkust:nkusttrash@cluster0-qg0j5.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    User.findOne({username: req.body.username},"username password",(err, result)=>
    {
        if (result === null){
            res.redirect('/login');
        }else{
            if (bcrypt.compareSync(req.body.password, result.password)) {
                req.session.regenerate(function () {
                    req.session.username = req.body.username;
                    console.log(req.session);
                    res.redirect('/');
                    console.log(req.session);
                });
            } else {
                res.redirect('/login');
            }
        }
    });
});

module.exports = router;
