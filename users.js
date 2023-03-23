const mongoose = require('mongoose')

const Schema = mongoose.Schema

const users = new Schema({
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

module.exports = mongoose.model('Users', users)