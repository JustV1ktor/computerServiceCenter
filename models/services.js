const mongoose = require('mongoose')
const {ObjectId} = require("mongodb");

const Schema = mongoose.Schema

const service = new Schema({
    name: {
        type: String,
        require: true
    },
    categoryID: {
        type: ObjectId,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('Service', service)