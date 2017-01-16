var ContentLikes = new require('../models/ContentLikes.js');
var jwt = require('../../node_modules/jsonwebtoken');
var Request = require('../models/request.js');
var topPosts = require('../models/topPosts.js');
var CommentLikes = require('../models/commentLikes.js');

exports.vote = function(req, res) {
    console.log(req.body);
    if(!req.body.jwt || req.body.jwt == null) {
        res.status(500).json({error: "User not logged in"})
    }
    var contentType;
    if(req.body.contentType == "toppost") {
        contentType = topPosts;
    }
        else if(req.body.contentType == "request") {
        contentType = Request;
    }
    console.log(req.body.contentType);
    var decoded = jwt.decode(req.body.jwt); // Gathers user.
    var contentlikes = new ContentLikes()

    if(req.body.vote == 1 || req.body.vote == -1) { // Checking if query value are valid.
        ContentLikes.findOne({userId: decoded._id, contentId: req.body.contentId}, function (err, content) {
            if(content) { // Checking if content is already upvoted or downvoted
                if(req.body.vote == content.vote) { // If query vote equals to the vote value stored in DB, the whole document is removed.
                    updateVotes(req.body.contentId, req.body.vote * -1); // Subtracts or adds one point from content, because the whole document is removed;
                    content.remove();
                } else { // If query and DB values differ..
                    updateVotes(req.body.contentId, req.body.vote * 2); // Adds or subtracts 2 points from content.
                    ContentLikes.update({userId: decoded._id, contentId: req.body.contentId}, {$set: {vote: req.body.vote}}, function(err, result) { // Updates document vote value
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("ContentLikes Vote update: " + result);
                        }
                    })
                }
            } else { // If document doesn't exist, creating a new one.
                contentlikes.vote = req.body.vote;
                contentlikes.userId = decoded._id;
                contentlikes.contentId = req.body.contentId;
                contentlikes.save();
                updateVotes(req.body.contentId, req.body.vote);
            }
        })
    } else {
        res.status(500).json({error: "Invalid vote input"});
    }

    function updateVotes(contId, vote) {
        contentType.update({_id: contId}, {$inc: {upVotes: vote}}, function (err, result) {
            console.log(result);
            if (err) {
                console.log(err)
            } else {
                console.log("Request Vote update: " + result)
                res.json({id: contId, vote: vote})
            }
        })
    }
}

exports.getUserVotes = function(req, res) {
    var decoded = jwt.decode(req.body.jwt);
    ContentLikes.find({userId: decoded}, function(err, data) {
        console.log(data);
        if(err) {
            res.json(err)
        } else {
            res.json(data);
        }
    })
}

exports.commentVote = function(req, res) {
    if(req.body.jwt == "") return res.status(500).json({error: "user not logged in"})
    if(typeof req.body.vote != "boolean") return res.status(500).json({error: "invalid vote parameter"})
    var decoded = jwt.decode(req.body.jwt);
    var model;
    if(req.body.contentType == "toppost") {
        model = topPosts;
        console.log("topost")
    } else if(req.body.contentType == "request") {
        model = Request;
        console.log("reuqest")
    }

    CommentLikes.findOne({commentId:req.body.commentId, userId:decoded._id}, function(err, result) {
        if(err) console.log(err)
        console.log(result)
        if(result == null) createLike(req.body.commentId)
        else modifyLike(result, req.body.id)

    })

    function createLike(id) {
        var commentLikes = new CommentLikes();
        var val = 0;
        if(req.body.vote == true) {
            commentLikes.votedUp = true;
            commentLikes.votedDown = false;
            val = 1;
        }
        else {
            commentLikes.votedDown = true;
            commentLikes.votedUp = false;
            val = -1;
        }
        commentLikes.userId = decoded._id;
        commentLikes.commentId = id;
        commentLikes.save();
        model.update(
            {_id:req.body.id,"comments.mainId":req.body.commentId},
            {$inc: {"comments.$.votes": val}},
            function(err, comment) {
                if(err) console.log(err)

            })
        res.json({id:req.body.commentId,votedUp:commentLikes.votedUp, votedDown:commentLikes.votedDown})
    }

    function modifyLike(result) {
        var vote = req.body.vote;
        var upVoted = result.votedUp.toString();
        var downVoted = result.votedDown.toString();
        var voteValue = 0;

        if(vote == true) {
            console.log("vote is true")
            if (upVoted == "false" && downVoted == "false") {
                upVoted = true;
                downVoted = false;
                voteValue = 1;
                console.log("1")
            }
            else if (upVoted == "true" && downVoted == "false") {
                upVoted = false;
                downVoted = false;
                voteValue = -1;
                console.log("2")
            }
            else if (upVoted = "false" && downVoted == "true") {
                upVoted = true;
                downVoted = false;
                voteValue = 2;
                console.log("3")
            }
        }
        console.log("??")
        console.log("true" == "true")

        if(vote == false) {
            console.log("vote is false")
            if(upVoted == "false" && downVoted == "false") {
                downVoted = true;
                upVoted = false;
                voteValue = -1;
                console.log("1")
            }
            else if(upVoted == "true" && downVoted == "false") {
                upVoted = false;
                downVoted = true;
                voteValue = -2;
                console.log("2")
            }
            else if(upVoted = "false" && downVoted == "true") {
                downVoted = false;
                upVoted = false;
                voteValue = 1;
                console.log("3")

            }
        }

        console.log("vote value: " + voteValue)

        model.update(
            {_id:req.body.id,"comments.mainId":req.body.commentId},
            {$inc: {"comments.$.votes": voteValue}},
            function(err, comment) {
                if(err) console.log(err)
            })

        CommentLikes.update({commentId:req.body.commentId, userId:decoded._id},
            {$set: {votedUp:upVoted, votedDown:downVoted}},
        function(err, result) {
            console.log("upvote: " + upVoted);
            console.log("downvote: " + downVoted);
            if(err) console.log(err)
            else res.json({id:req.body.commentId,votedUp:upVoted, votedDown:downVoted})
        })

    }
}