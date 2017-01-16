var multer = require('multer');
var CryptoJS = require("crypto");
var path = require('path');
var fs = require('fs-extra')
var AWS = require('aws-sdk');

var s3 = require('multer-s3');

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
})

AWS.config.region = "eu-central-1";

var photoBucket = new AWS.S3({params: {Bucket: 'ifafe'}});

exports.uploadToS3 = function(file, destFileName, callback) {
    photoBucket
        .upload({
            ACL: 'public-read',
            Body: fs.createReadStream(file.path),
            Key: destFileName.toString() + '.jpg',
            ContentType: 'application/octet-stream'
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

exports.upload = multer({storage: storage}).array("uploads", 12);

exports.guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}