var path = require('path');
function index(req, res) {
    res.sendFile(path.join(__dirname, '../../public/views', 'index.html'));
}
exports.index = index;
