const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    pseudo :  String
});

const UserModels = mongoose.model('user',UserSchema);
