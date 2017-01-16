var comment = require('./controllers/comment.js');
var Requests = require('./controllers/Requests.js');
var topPosts = require('./controllers/topPosts.js');
var likeController = require('./controllers/likeController.js');
var service = require('./controllers/serviceCtrl.js');
var inviteCtrl = require('./controllers/invitation-controller');

module.exports = function(app) {
    
//---------------------------------------------------------------
    app.put('/api/protected/request', Requests.postRequest);
    app.get('/api/getRequests', Requests.getRequests);
    app.post('/api/getMoreRequests', Requests.getRequestsByRank);
    app.post('/api/getOneRequest', Requests.getOneRequest);
//---------------------------------------------------------------
    app.post('/api/getComments', comment.getComments);
    app.put('/api/protected/postComment', comment.postComment);
//---------------------------------------------------------------
    app.get('/api/getTopPhotos', topPosts.getTopPhotos);
    app.post('/api/getOneTopPhoto', topPosts.getOneTopPhoto);
    app.post('/api/getMoreTopPhotos', topPosts.getMoreTopPhotos);
//---------------------------------------------------------------
    app.put('/api/contentVote', likeController.vote);
    app.post('/api/getUserVotes', likeController.getUserVotes);
    app.put('/api/commentVote', likeController.commentVote);
//---------------------------------------------------------------
    app.put('/api/protected/service', service.postService);
    app.get('/api/getServices', service.getServices);
//---------------------------------------------------------------
    app.post('/api/protected/invite', inviteCtrl.invite);
    app.post('/api/protected/getInvites', inviteCtrl.getInvites);
};