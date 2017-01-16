var Article = require('../models/article.js');



exports.post = function(req, res) {
    console.log(req.body);
    var article = new Article();
    article.text = req.body.text,
        article.save();
    res.json(article);
};

exports.get = function(req, res) {
    Article.find(function(err, article){
        if (err) {
            res.send(err);
        }
        res.json(article);
    });
};