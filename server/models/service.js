var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var serviceSchema = new Schema({
    about: {type: String, default: ''},
    title: {type: String, default: ''},
    nickname: {type: Array, default: ''},
    userId: {type: String, default: ''},
    tags: {type: Array, default: ''},
    portfolio: {type: Array, default: ''},
    rating: {type: Number, default: 0},
    reviews: {type: Array, default: ''}

    


});

module.exports = mongoose.model('Service', serviceSchema);



