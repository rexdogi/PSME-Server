var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var commentSchema = new Schema({
    text: { type: String, default: '' },
    id: { type: String, default: '', index:true },
    userId: { type: String, default: ''},
    photoIds: { type: Array},
    user: { type: Array, default: '', index: true},
    timeStamp: {type: Date, default:Date.now},
    votes: {type: Number, default: 0},
    clickedUp: {type: Boolean, default: false},
    clickedDown: {type: Boolean, default: false},
    isPhoto: {type: Boolean, default: false, index: true},
    commentLikes: {type: Array, index:true},
    mainId: {type: String, index:true}
});
    
module.exports = mongoose.model('Comment', commentSchema);