// THIS IS A SCHEMA
import mongoose from "mongoose";

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

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;