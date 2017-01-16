var Request = require('../models/request.js');
var topPosts = require('../models/topPosts.js');
var multer = require('multer');
var path = require('path');
var fs = require('fs-extra')
var S3 = require('./myMiddleWares/S3Upload.js')

exports.postRequest = function(req, res) {

    console.log(req.files);
    var request = new Request();
    var toppost = new topPosts();
    S3.upload(req,res, function (err) {
        console.log("upload function called");
        if(err) console.log(err);
        var parsed = JSON.parse(req.body.data);
        console.log(parsed);
        //if(parsed.title == null || parsed.title == '') return
        //else if(parsed.description == null || parsed.description == '') return
        // Data for request section
        request.description = parsed.description;

        toppost.description = parsed.description;
        console.log("file length is " + req.files.length);
        for(var i = 0; i < req.files.length; i++) {
            if(req.files[i].filename.split('.').pop() != 'jpg' && req.files[i].filename.indexOf('.') == -1) {
                return res.status(500).json({error:"invalid file extension"})
            }
            var pid = S3.guid();
            request.photoId[i] = pid;
            toppost.mainIds[i] = pid;
            S3.uploadToS3(req.files[i], pid, function (err, data) {
                console.log("uploading to S3..");
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
        request.save(function(err, res) {
            console.log("request saved");
            toppost.parentId = res._id;
            toppost.save();
            console.log("save res : " + res);
        });
    });
};

exports.getRequests = function(req, res) {
    Request.find(function(err, article){
        if (err) {
            res.send(err);
        }
        console.log("LUL");
        res.json(article);
    }).sort({ranking: -1}).limit(2);
};

exports.getRequestsByRank = function(req, res) {
    console.log(req.body.ranking);
    Request.find({ranking:{$lt:req.body.ranking}},function(err, todos) {
        if(err) {
            console.log("Todo:" + err)
        }
        else {
            res.json(todos);
        }
    }).sort({ranking: -1}).limit(2)
};

exports.getRequests = function(req, res) {
    Request.find(function(err, article){
        if (err) {
            res.send(err);
        }
        console.log("LUL " + new Date())
        res.json(article);
    }).sort({ranking: -1}).limit(2);
};

exports.getOneRequest = function(req, res) {
    Request.findOne({_id: req.body.id}, function(err, request) {
        console.log(req.body.id);
        if(err) {
            console.log(err)
        }
        console.log(request)
        res.json(request);
    })
}

exports.getMoreRequests = function(req, res) {
    Request.find({ranking:{$lt: req.body.rank}}, function(err, requests) {
        if(err) {
            res.json(err)
        } else {
            res.json(requests)
        }
    })
}

exports.updateRanking = function(req, res) {
    Request.aggregate([
        {
            $project: {
                rank: {
                    $let: {
                        vars: {
                            x: {$subtract: ["$upVotes", "$downVotes"]},
                            y: {$cond: {if: {$gt: [{$subtract: ["$upVotes", "$downVotes"]}, 0]}, then: 1, else:
                            {$cond: {if: {$eq: [{$subtract: ["$upVotes", "$downVotes"]}, 0]}, then:0, else: -1
                            }}}},
                            t: {$divide: [{$subtract: ["$dateStamp", new Date(2010,10,10)]},1000]},
                            z: {
                                $cond: {if: {$gte: [{$abs: {$subtract: ["$upVotes", "$downVotes"]}}, 1]},
                                    then: {$abs: {$subtract: ["$upVotes", "$downVotes"]}},
                                    else: {$cond: {if: {$lt: [{$abs: {$subtract: ["$upVotes", "$downVotes"]}}, 1]},
                                        then:1, else: {$abs: {$subtract: ["$upVotes", "$downVotes"]}}}}}
                            }
                        },
                        in: {$add: [{$log10: "$$z"}, {$divide: [{$multiply: ["$$y", "$$t"]}, 45000]}]}
                    }
                }
            }
        }
    ], function(err,res) {
        console.log(res);
        for(var i = 0; i < res.length; i++) {
            Request.update({_id:res[i]._id},
                {$set: {ranking: res[i].rank}
                }, function(err,data) {
                    if(err) {
                        console.log(err);
                    }
                    console.log(data);
                })
        }

    })
}