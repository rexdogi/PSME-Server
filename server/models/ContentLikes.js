var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var ContentLikeSchema = new Schema({
    contentId: {type: String},
    userId: {type: String, index: true},
    vote: {type: Number} // 1 is upvote, -1 is downvote.
});

module.exports = mongoose.model('ContentLikeSchema', ContentLikeSchema);
