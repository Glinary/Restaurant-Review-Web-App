// THIS IS A SCHEMA

const mongoose = require('mongoose')

const reviewsSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    reviewDesc: {
        type: String,
        required: true
    },
    starRating: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reviewTitle: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Reviews", reviewsSchema)
