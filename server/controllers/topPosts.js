var Request = require('../models/request.js');
var Comment = require('../models/comment.js');
var async = require('async');
var topPosts = require('../models/topPosts.js');
var request = require('./Requests.js');

var CronJob = require('cron').CronJob;
new CronJob('0 */1 * * * *', function() {
    updateRanking();
    request.updateRanking();
    updatePhotos();
}, null, true, 'America/Los_Angeles');

exports.getTopPhotos = function(req, res) {
    topPosts.find(function(err, photos) {
        if(err) {
            res.json(err)
        } else {
            res.json(photos)
        }
    }).sort({ranking: -1}).limit(2)
}

exports.getMoreTopPhotos = function(req, res) {
    topPosts.find({ranking:{$lt: req.body.ranking}}, function(err, photos) {
        if(err) {
            res.json(err)
        }
        else {
            res.json(photos);
        }
    }).sort({ranking: -1}).limit(2)
}

function updatePhotos () {
    var photos = [];
    var index = 0;
    var queueLength;
    var requests = [];
    function findRequests(callback) {
        Request.aggregate([
            {$unwind: "$comments"},
            {$sort: {"comments.votes" : -1}},
            {$match: {"comments.isPhoto": true}},
            {$group: {_id: "$_id", 'comments': {$push : "$comments"}}},
            {$project: {"comments": {$slice: ["$comments", 5]}}}
        ],
            function (err, request) {

            queueLength = request.length;
            if (request.length <= 0) {
                return
            } else {
                requests = request;
                callback();
            }
        })
    }

    function process() {
        pushRequests(requests[index].comments)

    }

    function pushRequests(src) {
            for (var i = 0; i < src.length; i++) {
                photos.push(src[i].photoIds[0])
                console.log(src[i].votes)
            }
            topPosts.update({parentId: src[0].id}, {$set: {otherIds: photos}}, function (err, result) {
                photos = [];
                index++;
                console.log(index);
                if (queueLength != index) {
                    process();
                }
            })
    }

    findRequests(function() {
        process();
    })

}

function updateRanking() {
    topPosts.aggregate([
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
        for(var i = 0; i < res.length; i++) {
            topPosts.update({_id:res[i]._id}, {$set: {ranking: res[i].rank}}, function(err,data) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            })
        }
    })
}

exports.getOneTopPhoto = function(req, res) {
    topPosts.findOne({_id: req.body.id}, function(err, request) {
        console.log(req.body.id);
        if(err) {
            console.log(err)
        }
        res.json(request);
    })
}