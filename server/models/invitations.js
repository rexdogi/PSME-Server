var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var InvitationSchema = new Schema({
    userId: {type: String},
    nickname: {type: String},
    userInvitedId: {type: String},
    picture: {type: String}

});

module.exports = mongoose.model('InvitationSchema', InvitationSchema);
/**
 * Created by Paulius on 8/21/2016.
 */
