const mongoose = require('mongoose')
const {ObjectId} = require("mongodb");

const Schema = mongoose.Schema

const carts = new Schema({
    userID: {
        type: ObjectId,
        require: true
    },
    serviceID: {
        type: ObjectId,
        require: true
    }
})

module.exports = mongoose.model('Carts', carts)