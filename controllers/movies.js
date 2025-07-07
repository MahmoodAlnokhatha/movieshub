const router = require("express").Router();
const Movie = require("../models/movie");

// عرض كل الأفلام
router.get("/", async (req, res) => {
  const movies = await Movie.find().populate("owner");
  res.render("movies/index.ejs", { movies });
});

// نموذج إضافة فيلم جديد
router.get("/new", (req, res) => {
  res.render("movies/new.ejs");
});

// إنشاء فيلم
router.post("/", async (req, res) => {
  req.body.owner = req.session.user._id;
  await Movie.create(req.body);
  res.redirect("/movies");
});

// عرض تفاصيل فيلم
router.get("/:movieId", async (req, res) => {
  const movie = await Movie.findById(req.params.movieId).populate("owner");
  const userHasLiked = movie.likes.some((user) => user.equals(req.session.user._id));
  const userHasDisliked = movie.dislikes.some((user) => user.equals(req.session.user._id));
  res.render("movies/show.ejs", { movie, userHasLiked, userHasDisliked });
});

// حذف فيلم
router.delete("/:movieId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (movie.owner.equals(req.session.user._id)) {
      await movie.deleteOne();
      res.redirect("/movies");
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// نموذج تعديل فيلم
router.get("/:movieId/edit", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    res.render("movies/edit.ejs", { movie });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// تعديل فيلم
router.put("/:movieId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (movie.owner.equals(req.session.user._id)) {
      await movie.updateOne(req.body);
      res.redirect("/movies");
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// إضافة لايك
router.post("/:movieId/liked-by/:userId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie.dislikes.includes(req.params.userId)) {
      await Movie.findByIdAndUpdate(req.params.movieId, {
        $push: { likes: req.params.userId }
      });
    }
    res.redirect(`/movies/${req.params.movieId}`);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// إزالة لايك
router.delete("/:movieId/liked-by/:userId", async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.movieId, {
    $pull: { likes: req.params.userId }
  });
  res.redirect(`/movies/${req.params.movieId}`);
});

// إضافة ديسلايك
router.post("/:movieId/disliked-by/:userId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie.likes.includes(req.params.userId)) {
      await Movie.findByIdAndUpdate(req.params.movieId, {
        $push: { dislikes: req.params.userId }
      });
    }
    res.redirect(`/movies/${req.params.movieId}`);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// إزالة ديسلايك
router.delete("/:movieId/disliked-by/:userId", async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.movieId, {
    $pull: { dislikes: req.params.userId }
  });
  res.redirect(`/movies/${req.params.movieId}`);
});

module.exports = router;