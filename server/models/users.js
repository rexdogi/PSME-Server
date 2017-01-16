var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var userSchema = new Schema({
    given_name: { type:String, default: ''},
    family_name: { type: String, default: '' },
    picture: { type: String, default: '' },
    gender: { type: String, default: ''},
    locale: { type: Array, default: ''},
    updated_at: { type: String},
    requestPosts: { type: Array},
    servicePosts: { type: Array},
    isAdmin: {type: String, default: false},
    updated_at: { type: String},
    identities: { type: Array},
    created_at: { type: String},
    last_ip: { type: String},
    last_login: { type: String},
    nickname: { type: String},
    user_id: { type: String},
    last_ip: { type: String},
    last_login: { type: String},
    logins_count: { type: String},
    blocked_for: { type: String},
    friends: {type: Array}

    
});

module.exports = mongoose.model('users', userSchema);