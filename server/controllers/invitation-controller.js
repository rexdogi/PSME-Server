/**
 * Created by Paulius on 8/21/2016.
 */

var Invitations = require('../models/invitations');
var User = require('../models/users');

exports.invite = function(req, res) {
    var invitation = new Invitations();
    invitation.userId = req.body.userId;
    invitation.picture = req.body.picture;
    invitation.userInvitedId = req.body.userInvitedId;
    invitation.nickname = req.body.nickname;
    
    invitation.save();
    res.json({name: ''})
};

exports.getInvites = function(req, res) {
    Invitations.find({userInvitedId: req.body.userId}, function(err, invites) {
        if(err) console.log(err);
        res.json(invites);
    })
};

exports.confirm = function(req, res) {
    var userId = req.body.userId;
    var userInvitedId = req.body.userInvitedId;

   // User.findOne({user_id: userId}, {$push : {friends:}})

    Invitations.findOne({_id: invitationId}, function(req) {

    })
}