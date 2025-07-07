// controllers/movies.js
const router = require("express").Router();
const Movie = require("../models/movie"); // I have to do it later 7-7-2025

// show all the movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().populate("owner");
  res.render("movies/index.ejs", { movies });
});

// adding new movie AAM
router.get("/new", (req, res) => {
  res.render("movies/new.ejs");
});

// posting a movie PAM
router.post("/", async (req, res) => {
  req.body.owner = req.session.user._id;
  await Movie.create(req.body);
  res.redirect("/movies");
});

module.exports = router;
