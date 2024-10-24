const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");
const Campground = require("../models/campground");
mongoose.connect("mongodb://localhost:27017/yelp-camp");

db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seeddb = async () => {
  await Campground.deleteMany();
  //   const c = new Campground({ title: "purple field" });
  //   await c.save();
  // };

  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
    });
    await camp.save();
  }
};

seeddb().then(() => {
  mongoose.connection.close();
});
