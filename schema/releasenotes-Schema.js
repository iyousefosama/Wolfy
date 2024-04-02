const { Schema, model } = require('mongoose');

const releasenotes = new Schema({
    Updates: String,
    Date: String,
    Developer: String,
    Version: Number
});

module.exports = model('releasenotes', releasenotes);