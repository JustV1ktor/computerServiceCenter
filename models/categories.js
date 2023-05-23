const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categories = new Schema({
    name: {
        type: String,
        require: true
    },
    isVisible: {
        type: Boolean,
        require: true
    }
})

module.exports = mongoose.model('Categories', categories)