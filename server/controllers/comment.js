var Comment = require('../models/comment.js');
var S3 = require('./myMiddleWares/S3Upload.js')
var fs = require('fs-extra');
var Comment = require('../models/comment.js');
var topPosts = require('../models/topPosts.js');
var Request = require('../models/request.js');
var User = require('./myMiddleWares/getUserData.js')
var jwt = require('../../node_modules/jsonwebtoken');

exports.postComment = function(req, res) { // Creates a comment in the content section.
    var comment = new Comment();
    var contentType;
    S3.upload(req,res, function (err) {
        console.log(req.body.data)
        var parsed = JSON.parse(req.body.data); // Parsing form data.
        if(parsed.contentType == "toppost") {
            contentType = topPosts
        } else if(parsed.contentType == "request") {
            contentType = Request
        }
        comment.text = parsed.text;
        comment.id = parsed.id;
        var jwtData = jwt.decode(req.headers['x-access-token']);
        var userId = jwtData.sub;
        comment.mainId = S3.guid();
        if(req.files.length > 0) {
            comment.isPhoto = true;
        }
        if(req.files.length != 0) {
            for (var i = 0; i < req.files.length; i++) {
                if(req.files[i].filename.split('.').pop() != 'jpg' && req.files[i].filename.indexOf('.') == -1) {
                    return res.status(500).json({error:"invalid file extension"})
                }
                var pid = S3.guid();
                comment.photoIds[i] = pid;
                S3.uploadToS3(req.files[i], pid, function (err, data) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('failed to upload to s3').end();
                    } else {
                        fs.emptyDir(__dirname + '/../../uploads', function(err) {
                            if(!err) console.log("success")
                        })
                    }
                })
            }
        }
        User.getUser(userId, function(user) {7
            comment.user = user;
            process(comment, function (src) {
                res.json(comment);
            });
        });


        function process(comment, callback) { // Gets user data for the comment information.

            contentType.update({_id:comment.id},{$push: {comments: comment} }, function(err, res) {
                if(err) {
                    console.log(err)
                } else {
                    console.log(res);
                    callback();
                }
            })
        }
    });
};

exports.getComments = function(req, res) { // Gets all the comments by the content ID.

    Comment.find({id: req.body.id}, function (err, comment) {
        if(err) {
            console.log(err);
        }
        res.json(comment);

    }).sort({upVotes: -1});
};

