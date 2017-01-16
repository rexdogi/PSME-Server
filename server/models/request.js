var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var requestSchema = new Schema({
    description: { type: String, default: ''},
    photoId: { type: Array, default: ''},
    upVotes: {type: Number,default: 1},
    downVotes: {type: Number, default:0},
    commentCount: {type: Number, default: 0},
    dateStamp: {type: Date, default: Date.now},
    ranking: {type: Number, default: 0},
    creator: {type: Object},
    comments: {type: Array, index: true},
    parentId: { type: String, default: '', index: true}


});

module.exports = mongoose.model('Request', requestSchema);