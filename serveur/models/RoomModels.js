const mongoose = require("mongoose");

var RoomShema = new mongoose.Schema({
    name :  String
});

mongoose.model('room',RoomShema);
