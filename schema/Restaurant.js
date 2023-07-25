// THIS IS A SCHEMA

const mongoose = require('mongoose')

const restoSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
        rquired: true
    },
    desc: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    starRating: {
        type: Number,
        default: null
    }
})

module.exports = mongoose.model("Restaurant", restoSchema)
