const mongoose = require('mongoose')

const Schema = mongoose.Schema

const service = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Service', service)