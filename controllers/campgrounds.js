const Campground = require("../models/campground.js");
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
const campground = require("../models/campground.js");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    {
      limit: 1,
    }
  );
  //   res.send(geoData.features[0].geometry);
  const campground = new Campground(req.body.campground);

  //   // console.log(req.body);
  //   // if (!req.body.campground)
  //   //   throw new ExpressError("Invalid Campground data", 400);

  campground.geometry = geoData.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // console.log(campground);
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });

  // console.log(campground);

  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "can not find the campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  // const campground = await Campground.findByIdAndUpdate(id, {
  //   title: "something",
  //   location: "ihf",
  // });
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location,
    { limit: 1 }
  );
  campground.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  // console.log(campground);
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
  // res.send("worked");
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
