var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var CommentLikeSchema = new Schema({
    commentId: {type: String, index: true},
    userId: {type: String, index: true},
    votedUp: {type: Boolean, defaut: false}, // 1 is upvote, -1 is downvote.
    votedDown: {type: Boolean, default: false}
});

module.exports = mongoose.model('CommentLikeSchema', CommentLikeSchema);
