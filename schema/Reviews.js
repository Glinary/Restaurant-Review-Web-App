// THIS IS A SCHEMA

const mongoose = require("mongoose");

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
      email: {
        type: String,
      },
      reply: {
        type: String,
      },
      user: {
        type: String,
      },
      repID: {
        type: mongoose.Types.ObjectId,
      },
      replyTo: {
        type: mongoose.Types.ObjectId,
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
  isEdited: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Reviews", reviewsSchema);
