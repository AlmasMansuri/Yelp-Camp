const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "My Backyard",
//     price: 12,
//   });
//   await camp.save();
//   res.send(camp);
// });

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.post("/campgrounds", async (req, res) => {
  console.log(req.body);
  const campground = new Campground(req.body.campground);
  console.log(campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  console.log(campground);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});
app.listen(2000, () => {
  console.log("listening on port 2000 http://localhost:2000 ");
});
