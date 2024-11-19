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

  for (let i = 0; i < 300; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "672b62452d1218ee75a20cac",
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      // image: `https://picsum.photos/400?random=${Math.random()}`,
      description: "lrem ipsum",
      price,
      geometry: {
        type: "Point",
        coordinates: [cities[rand].longitude, cities[rand].latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dxt9esphq/image/upload/v1731501021/YelpCamp/mgs3msbxz9h3ipslonul.jpg",
          filename: "YelpCamp/mgs3msbxz9h3ipslonul",
        },
        {
          url: "https://res.cloudinary.com/dxt9esphq/image/upload/v1731501021/YelpCamp/iy5l35uubpsk4vkvcwvv.jpg",
          filename: "YelpCamp/iy5l35uubpsk4vkvcwvv",
        },
      ],
    });
    await camp.save();
  }
};

seeddb().then(() => {
  mongoose.connection.close();
});
