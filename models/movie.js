const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movie: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Comedy", "History", "Action", "Romance"],
    required: true
  },
  platformLink: {
    type: String
  },
  status: {
    type: String,
    enum: ["to be watched", "watched", "good during night shifts", "dont watch it"],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;