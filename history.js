const mongoose = require('mongoose')

const Schema = mongoose.Schema

const history = new Schema({
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

module.exports = mongoose.model('History', history)