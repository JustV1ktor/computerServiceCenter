const mongoose = require('mongoose')

const Schema = mongoose.Schema

const carts = new Schema({
    userID: {
        type: Object,
        require: true
    },
    service: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Carts', carts)