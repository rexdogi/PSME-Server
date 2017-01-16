
var email = function(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

var password = function(password) {
    var regex = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/;
    return regex.test(password)
}

var username = function(username) {
    var regex = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;
    return regex.test(username)
}

var confirmPassword = function(password1, password2) {
    return password1 == password2
    
}

var encrypt = function() {

}

exports.email = email;
exports.password = password;
exports.username = username;
exports.confirmPassword = confirmPassword;
exports.encrypt = encrypt;
