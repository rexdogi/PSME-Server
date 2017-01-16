var topPosts = require('../models/topPosts.js');
var multer = require('multer');
var CryptoJS = require("crypto");
var path = require('path');
var fs = require('fs-extra')
var AWS = require('aws-sdk');
var s3 = require('multer-s3');
var Service = require('../models/service.js');
var jwt = require('../../node_modules/jsonwebtoken');
var getUser = require('./myMiddleWares/getUserData.js');

AWS.config.update({
    accessKeyId: 'AKIAIN2YTKALHKHFITCA',
    secretAccessKey: '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'
})

AWS.config.region = "eu-central-1";

var photoBucket = new AWS.S3({params: {Bucket: 'ifafe'}});

function uploadToS3(file, destFileName, callback) {
    photoBucket
        .upload({
            ACL: 'public-read',
            Body: fs.createReadStream(file.path),
            Key: destFileName.toString() + '.jpg',
            ContentType: 'application/octet-stream' // force download if it's accessed as a top location
        })
        .send(callback);
}

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        CryptoJS.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});

var upload = multer({storage: storage}).array("uploads", 12);

exports.postService = function(req, res) {
    upload(req,res, function (err) {
        if(err) console.log(err);
        var userData;
        var service = new Service();
        var parsed = JSON.parse(req.body.data);
        var jwtData = jwt.decode(req.headers['x-access-token']);
        var userId = jwtData.sub;
        userData = getUser.getUser(userId, function(user) {
            userData = user;
            service.about = parsed.about;           // Data for request section
            service.tags = parsed.tags;
            service.title = parsed.title;

            service.nickname = userData.nickname;
            service.userId = userData.user_id;

            if(req.files.length != 0) {
                for (var i = 0; i < req.files.length; i++) {
                    if (req.files[i].filename.split('.').pop() != 'jpg' && req.files[i].filename.indexOf('.') == -1) {
                        return res.status(500).json({error: "invalid file extension"})
                    }
                    var pid = guid();
                    service.portfolio[i] = pid;

                    uploadToS3(req.files[i], pid, function (err, data) {
                        console.log("uploading to S3..");
                        if (err) {
                            console.error(err);
                            return res.status(500).send('failed to upload to s3').end();
                        } else {
                            fs.emptyDir(__dirname + '/../../uploads', function (err) {
                                if (!err) console.log("success")
                            })
                        }
                    })
                }
            }
            service.save();
            res.json({success: true})
        });
    });
};

exports.addReview = function(req, res) {

};


exports.getServices = function(req, res) {
    Service.find(function (err, services) {
        if(err) console.log(err);
        res.json(services);
    })
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}