const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema({
    userID: {
        type: Object,
        require: true
    },
    service: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    }
})

module.exports = mongoose.model('User', user)