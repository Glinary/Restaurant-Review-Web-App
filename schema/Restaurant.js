// THIS IS A SCHEMA

import mongoose from "mongoose";

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
        required: true,
        unique: true
    },
    starRating: {
        type: Number,
        default: null
    }
})


const Restaurant = mongoose.model('Restaurant', restoSchema);
export default Restaurant;