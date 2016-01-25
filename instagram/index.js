var router = require('express').Router();
var async = require('async');
var cookieParser = require('cookie-parser');
var instagramApi = require('instagram-node').instagram();
var fs = require('fs');
var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var Image = require('../models/image');
var config = require('./config');

Bluebird.promisifyAll(instagramApi);

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

/* Redirect user to Instagram for authentication */
router.get('/authorize-user', function (req, res) {
    instagramApi.use({
        client_id: config.instagram_client_id,
        client_secret: config.instagram_client_secret
    });
    res.redirect(instagramApi.get_authorization_url(config.instagram_redirect_uri, { scope: ['public_content'] }));
});

/* Set cookie once Instagram sends access code */
router.get('/handleauth', function (req, res) {
    instagramApi.authorize_userAsync(req.query.code, config.instagram_redirect_uri)
    .then(function (result) {
        res.cookie('instaToken',result.access_token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    })
    .catch(function (errors) {
        console.log(errors);
    });
});

router.get('/api/images', function (req, res, next) {
    if (req.cookies.instaToken) {
        instagramApi.use({ access_token: req.cookies.instaToken });
        return instagramApi.tag_media_recentAsync('chip', { count: 50 })
        .then(function(images) {
            var insertImage = function (image) {
                async.waterfall([
                    function(callback) {
                        Image.findOne({ imageId: image.id }, function(err, result) {
                            if (result === null) {
                                // image not in db, so create it
                                callback(err, image);
                            }
                        });
                    },
                    function(image) {
                        var image = new Image({
                            imageId: image.id,
                            url: image.images.standard_resolution.url,
                            random: [Math.random(), 0]
                        });

                        image.save(function(err) {
                            if (err) return next(err);
                        });
                    }
                ]);
            };

            var extractImage = function (images) {
                var index = Math.floor(Math.random() * images.length - 1) + 1;
                var image = images[index];

                images = images.splice(index, 1);

                insertImage(image);

                return image;
            };

            res.send([extractImage(images), extractImage(images)]);
        })
        .catch(function (errors) {
            console.log(errors);
        });
    } else {
        res.redirect('/');
    }
});

router.put('/api/images', function(req, res, next) {
    var winner = req.body.winner;

    if (!winner) {
        return res.status(400).send({ message: 'Voting requires a winner.' });
    }

    async.waterfall([
        function(callback) {
            Image.findOne({ imageId: winner }, function(err, image) {
                callback(err, image);
            });
        },
        function(image) {
            image.wins++;
            image.random = [Math.random(), 0];
            image.save(function(err) {
                if (err) return next(err);
                res.send({ message: 'You voted successfully!' });
            });
        }
    ]);
});

router.get('/api/popular', function (req, res) {
    Image
        .find()
        .sort({'wins': -1})
        .exec(function(err, images) {
            if (err) return next(err);

            return res.send(images);
        });
});

router.get('/popular', function (req, res) {
    res.render('index', {});
});

/* Index Page */
router.get('/', function (req, res) {
    if (req.cookies.instaToken) {
        res.render('index', {
            access_token: req.cookies.instaToken
        });
    } else {
        res.render('index', {
            showLogin: true
        });
    }
});

module.exports = router;
