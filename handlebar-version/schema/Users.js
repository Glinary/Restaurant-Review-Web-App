// THIS IS A SCHEMA

const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userDescription: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Users", usersSchema)
