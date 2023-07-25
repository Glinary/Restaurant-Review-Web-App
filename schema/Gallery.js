// THIS IS A SCHEMA

const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Gallery", gallerySchema)
