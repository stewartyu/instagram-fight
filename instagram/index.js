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

router.get('/api/images', function (req, res) {
    instagramApi.use({ access_token: req.cookies.instaToken });
    return instagramApi.tag_media_recentAsync('chip', { count: 50 })
    .then(function(images) {
        var insertImage = function (image) {
            async.waterfall([
                function(callback) {
                    Image.findOne({ imageId: image.id }, function(err) {
                        callback(err, image);
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
});

router.put('/api/images', function(req, res, next) {
  var winner = req.body.winner;

  if (!winner) {
    return res.status(400).send({ message: 'Voting requires a winner.' });
  }

  async.parallel([
      function(callback) {
        Image.findOne({ imageId: winner.id }, function(err, winner) {
          callback(err, winner);
        });
      }
    ],
    function(err, results) {
      if (err) return next(err);

      var winner = results[0];

      if (!winner) {
          // image not stored yet, so let's create it
          var image = new Image({
            imageId: characterId,
            url: image.images.standard_resolution.url,
            random: [Math.random(), 0]
          });

          image.save(function(err) {
            if (err) return next(err);
            res.send({ message: 'Image has been added successfully!' });
          });
      }

      async.parallel([
        function(callback) {
          winner.votes++;
          winner.random = [Math.random(), 0];
          winner.save(function(err) {
            callback(err);
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.status(200).end();
      });
    });
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
