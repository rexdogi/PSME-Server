var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var topPostSchema = new Schema({
    description: { type: String, default: ''},
    mainIds: { type: Array, default: ''},
    otherIds: { type: Array},
    upVotes: {type: Number, default: 1},
    downVotes: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},
    ranking: {type:Number, default:0},
    parentId: { type: String, default: '', index: true},
    dateStamp: {type: Date, default: Date.now},
    creator: {type: Object},
    comments: {type: Array, index: true}
});

module.exports = mongoose.model('topPosts', topPostSchema);