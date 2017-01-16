/**
 * Created by Paulius on 8/20/2016.
 */
var socketioJwt = require('socketio-jwt');

module.exports = function(io) {
    var userList = [];

    io.on('connection', socketioJwt.authorize({
        secret: Buffer(),
        audience: '',
        timeout: 15000
    })).on('authenticated', function(socket) {

        console.log("user connected and authenticated");

        socket.on('user-data', function(data) {

            var elementPos = userList.map(function(x) {
                return x.nickname; }
            ).indexOf(data.nickname);

            if(elementPos != -1) return;
            userList.push({nickname: data.nickname, id: socket.id});
            console.log(userList);
        });

        socket.on('disconnect', function () {

            var elementPos = userList.map(function(x) {
                return x.id; }
            ).indexOf(socket.id);
            userList.splice(elementPos, 1);
        });

        socket.on('addFriend', function(user) {
            console.log(user);
            var elementPos = userList.map(function(x) {
                return x.nickname; }
            ).indexOf(user.id.nickname);
            io.to(userList[elementPos].id).emit('addFriend', user);
        })


    });

    
};

