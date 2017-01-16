var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var todoSchema = new Schema({
    text: { type: String, default: '' },
    rank: { type: Number, default: 0}
});

module.exports = mongoose.model('Todo', todoSchema);