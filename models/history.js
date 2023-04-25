const mongoose = require('mongoose')
const {ObjectId} = require("mongodb");

const Schema = mongoose.Schema

const history = new Schema({
    date: {
        type: Date,
        require: true
    },
    userID: {
        type: ObjectId,
        require: true
    },
    serviceIDs: {
        type: Array,
        require: true
    },
    totalSum: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('History', history)