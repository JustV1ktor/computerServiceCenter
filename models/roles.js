const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roles = new Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
})

module.exports = mongoose.model('Roles', roles)