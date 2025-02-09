const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: String,
    fileupload: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
