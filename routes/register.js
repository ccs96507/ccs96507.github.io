var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../users_model.js');



router.get('/', function(req, res, next) {
    res.render('register', {title:'Register Page'});
});


router.post('/',
    [
        check('email').isEmail(),
        check('password').isLength({min: 6}),
        // check('password').matches(pattern="^(?=.*d)(?=.*[a-zA-Z]).{6,}$"),
        sanitizeBody('name').trim().escape(),
        sanitizeBody('password').trim().escape(),
        sanitizeBody('email').trim().escape(),
        sanitizeBody('username').trim().escape(),

    ],(req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()){
            return res.status(422).json({errors: err.array()});
        }
        mongoose.connect('mongodb+srv://leojudya:yahoo123@cluster0-qg0j5.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});
        mongoose.Promise = global.Promise;
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        let userDoc = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });


        User.findOne({username: req.body.username},(err, result)=>
        {
            if (result === null){
                userDoc.save((err) =>{
                    res.redirect('/login');
                });
            }else{
                res.redirect('/register');
            }
        });

        });


module.exports = router;