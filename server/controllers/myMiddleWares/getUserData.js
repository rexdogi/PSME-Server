var users = require('../../models/users.js');

    var getUser = function (userId, callback) {
      //  console.log(userId)
        if(userId.startsWith('auth0')) {
            var id = userId.split('|').pop();
            //console.log("id: " + id);
            users.findOne({_id: id}, function(err, user) {
                if(err) console.log(err);
                console.log(user);
                var userData = {
                    nickname: user.nickname,
                    picture: user.picture,
                    id:userId,
                    given_name: user.given_name,
                    family_name: user.family_name

                };
                callback(userData);
                return user;
            });

            /*User ID by Social Login*/
        } else {
            users.findOne({user_id: userId},function(err, userFullData) {
                if(err) console.log(err);
              //  console.log(userFullData);
                var data = JSON.parse(JSON.stringify(userFullData));
                var userData = {
                    nickname: data.nickname,
                    picture: data.picture,
                    id:userId,
                    given_name: data.given_name,
                    family_name: data.family_name

                };
                callback(userData)
            })
        }

    };

exports.getUser = getUser;


