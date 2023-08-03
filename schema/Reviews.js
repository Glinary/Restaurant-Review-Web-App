// THIS IS A SCHEMA

import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  restaurantName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  reviewDesc: {
    type: String,
    required: true,
  },
  starRating: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reviewTitle: {
    type: String,
    required: true,
  },
  reviewReplyInfo: [
    {
      reply: {
        type: String,
      },
      user: {
        type: String,
      },
    },
  ],
  reactionInfo: {
    likeCount: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
export default Reviews;
