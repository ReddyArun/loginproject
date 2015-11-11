var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var hash = require(path.join(__dirname, '../', '../', './pass')).hash;
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res, next) {
    authenticate(req.body.username, req.body.password, mongoose.model('users'), function (err, user) {
        if (user) {
            req.session.user = user;
            return res.json(user);
        } else
            return err;
    });
});
/*
 Helper Functions
 */
function authenticate(name, pass, user, fn) {
    if (!module.parent)
        console.log('authenticating %s', name);

    user.findOne({
        username: name
    },
            function (err, user) {
                if (user) {
                    if (err)
                        return fn(new Error('cannot find user'));
                    hash(pass, user.salt, function (err, hash) {
                        if (err)
                            return fn(err);
                        if (hash == user.hash)
                            return fn(null, user);
                        fn(new Error('invalid password'));
                    });
                } else {
                    return fn(new Error('cannot find user'));
                }
            });

}
module.exports = router;