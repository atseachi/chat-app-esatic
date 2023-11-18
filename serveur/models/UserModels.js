const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    pseudo :  String
});

mongoose.model('user',UserSchema);
