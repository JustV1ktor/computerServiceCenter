const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema({
    login: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('User', user)