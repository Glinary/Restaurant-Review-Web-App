// ---------- Dependencies #1 ---------- //
import express from "express";
import exphbs from "express-handlebars";
import routes from './routes/routes.js';
const app = express();
import path from "path";
// ---------- Dependencies #1 ---------- //

// ---------- Dependencies #2 ---------- //
import mongoose from "mongoose";
import upload from "./middleware/upload.js"; //uploading js
const connectionString = "mongodb://127.0.0.1:27017/reviews";

//CAUTION: UNCOMMENT TO DROP SCHEMA DATA
/*
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to mongodb");
    // Drop the Reviews collection
    return Reviews.collection.drop();
  })
  .then(() => {
    console.log("The Reviews collection has been dropped.");
    // Optionally, you can close the connection after the operation is done.
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error connecting to mongodb:", error);
  });
*/
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.error("Error connecting to mongodb:", error);
  });

app.use(express.urlencoded({ extended: true }));

/* ---------- MANUALLY PUSH SAMPLE DATA TO SCHEMA ---------- */
/*

run()
async function run() {
    const reviewSample = await Reviews.create({
        restaurantName: "tnb",
        userName: "harry",
        reviewDesc: "lorem ipsum",
        starRating: "5.0"
    });
    console.log(reviewSample);
}
*/

/* ---------- MANUALLY PUSH SAMPLE DATA TO SCHEMA ---------- */

// ---------- Dependencies #2 ---------- //

// Set views folder to 'public' for accessibility
app.set("views", "./views");

const ifCondHelper = function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
};

// State hbs as view engine and views folder for views
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    helpers: {
      capitalize: function (string) {
        return string.toUpperCase();
      },
      ifCond: ifCondHelper, // Register the ifCond helper
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

//INSERT RESTAURANTS TO SCHEMA
//run(); // run only once
async function run() {
  //RESTAURANTS
  const restaurant1 = await Restaurant.create({
    link: "/RestoView-SB",
    img: "assets/starbucks.jpg",
    desc: "Indulge in the ultimate coffee experience along with its exceptional brews, comfortable ambiance, and everlasting uniqueness.",
    name: "Starbucks",
  });
  const restaurant2 = await Restaurant.create({
    link: "/RestoView-DTH",
    img: "assets/DTH.jpg",
    desc: "Let the authentic taste of Chinese cuisine from delicate dim sum to tantalizing stir-fries be at your reach anytime.",
    name: "David's Tea House",
  });
  const restaurant3 = await Restaurant.create({
    link: "/RestoView-TNB",
    img: "assets/TNB.jpeg",
    desc: "Experience the mouthwatering savory taste of grilled delicacies that everyone crave for.",
    name: "Tinuhog ni Benny",
  });
  const restaurant4 = await Restaurant.create({
    link: "/RestoView-ADB",
    img: "assets/ADB.png",
    desc: "Ignite your senses with one of the all-time Filipino favorite Adobo where every bite is burst of culinary passion.",
    name: "Angry Dobo",
  });

  //USERS
  const user1 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "harry@yahoo.com",
    userName: "Harry Potter",
    accountType: "viewer",
    password: "harry123",
    userDescription:
      "At the age of one, Harry's parents are killed by Lord Voldemort, who then attempts to kill him with the Killing Curse. Due to The Power of Love from his mother's self-sacrifice, however, he survives and rebounds the curse upon Voldemort, getting a lightning bolt-shaped scar as a souvenir. The series' resident Eccentric Mentor, Dumbledore, then arranges to have his Muggle aunt and uncle take him in or else.",
    avatar: "assets\\harry.jpg",
  });
  const user2 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "granger@yahoo.com",
    userName: "Hermoine Granger",
    accountType: "viewer",
    password: "granger123",
    userDescription: "Just your typical Magician Girl :>",
    avatar: "assets\\granger.jpg",
  });
  const user3 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "ronald@gmail.com",
    userName: "Ronald Weasly",
    accountType: "viewer",
    password: "ronald123",
    userDescription: "I like sushi and coffee! Hit me up",
    avatar: "assets\\ronald.jpg",
  });
  const user4 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "dumbo@gmail.com",
    userName: "Albus Dumbledore",
    accountType: "viewer",
    password: "dumbo123",
    userDescription:
      "I'm so old already but I still crave for Chinese Cuisine!",
    avatar: "assets\\dumbo.jpg",
  });
  const user5 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "bilbo@gmail.com",
    userName: "Bilbo Baggins",
    accountType: "viewer",
    password: "bilbo123",
    userDescription: "I'm a bully but em so cute",
    avatar: "assets\\bilbo.jpg",
  });

  //GALLERY
  const pic1 = await Gallery.create({
    link: "assets\\AD1.jpg",
    restaurantName: "Angry Dobo",
  });
  const pic2 = await Gallery.create({
    link: "assets\\AD2.jpg",
    restaurantName: "Angry Dobo",
  });
  const pic3 = await Gallery.create({
    link: "assets\\AD3.jpg",
    restaurantName: "Angry Dobo",
  });
  const pic4 = await Gallery.create({
    link: "assets\\AD4.jpg",
    restaurantName: "Angry Dobo",
  });

  const pic5 = await Gallery.create({
    link: "assets\\DT1.jpg",
    restaurantName: "David's Tea House",
  });
  const pic6 = await Gallery.create({
    link: "assets\\DT2.jpg",
    restaurantName: "David's Tea House",
  });
  const pic7 = await Gallery.create({
    link: "assets\\DT3.jpg",
    restaurantName: "David's Tea House",
  });
  const pic8 = await Gallery.create({
    link: "assets\\DT4.jpg",
    restaurantName: "David's Tea House",
  });

  const pic9 = await Gallery.create({
    link: "assets\\SB1.jpg",
    restaurantName: "Starbucks",
  });
  const pic10 = await Gallery.create({
    link: "assets\\SB2.jpg",
    restaurantName: "Starbucks",
  });
  const pic11 = await Gallery.create({
    link: "assets\\SB3.jpg",
    restaurantName: "Starbucks",
  });
  const pic12 = await Gallery.create({
    link: "assets\\SB4.jpg",
    restaurantName: "Starbucks",
  });
  const pic13 = await Gallery.create({
    link: "assets\\SB5.jpg",
    restaurantName: "Starbucks",
  });
  const pic14 = await Gallery.create({
    link: "assets\\SB6.jpg",
    restaurantName: "Starbucks",
  });

  const pic15 = await Gallery.create({
    link: "assets\\TNBF1.jpg",
    restaurantName: "Tinuhog ni Benny",
  });
  const pic16 = await Gallery.create({
    link: "assets\\TNBF2.jpg",
    restaurantName: "Tinuhog ni Benny",
  });
  const pic17 = await Gallery.create({
    link: "assets\\TNBF3.jpg",
    restaurantName: "Tinuhog ni Benny",
  });
  const pic18 = await Gallery.create({
    link: "assets\\TNBF4.jpg",
    restaurantName: "Tinuhog ni Benny",
  });
  const pic19 = await Gallery.create({
    link: "assets\\TNBF5.jpg",
    restaurantName: "Tinuhog ni Benny",
  });
  const pic20 = await Gallery.create({
    link: "assets\\TNBF6.jpg",
    restaurantName: "Tinuhog ni Benny",
  });

  //REVIEWS
  const rev1 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Starbucks",
    avatar: "assets\\harry.jpg",
    userName: "Harry Potter",
    reviewDesc:
      "The coffee was tasty as usual. The café was very clean as well. Definitely going back again.",
    starRating: 5,
    email: "harry@yahoo.com",
    reviewTitle: "Best Coffee In Town!",
    images: ["assets\\SB1.jpg", "assets\\SB2.jpg"],
  });
  const rev2 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "David's Tea House",
    avatar: "assets\\harry.jpg",
    userName: "Harry Potter",
    reviewDesc:
      "The taste is not that consistent. Sometimes the broccoli was cooked very well and sometimes it gets too salty. Sometimes the serving is too little for its price. Overall, most of their food is still delicious but it’s not consistent and not so affordable.",
    starRating: 4,
    email: "harry@yahoo.com",
    reviewTitle: "Need Taste Improvement",
    images: ["assets\\DT1.jpg", "assets\\DT2.jpg"],
  });

  const rev3 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Tinuhog ni Benny",
    avatar: "assets\\granger.jpg",
    userName: "Hermoine Granger",
    reviewDesc:
      "I wasnt a fan of grilled food, but TNB made me crave grilled delicacies every day!",
    starRating: 5,
    email: "granger@yahoo.com",
    reviewTitle: "Yummy Grilled Foods",
    images: ["assets\\TNBF1.jpg", "assets\\TNBF2.jpg"],
  });
  const rev4 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Angry Dobo",
    avatar: "assets\\granger.jpg",
    userName: "Hermoine Granger",
    reviewDesc: "For years, they still have the best adobo ever!",
    starRating: 5,
    email: "granger@yahoo.com",
    reviewTitle: "BEST ADOBO PA REN",
    images: ["assets\\AD1.jpg", "assets\\AD2.jpg"],
  });

  const rev5 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Tinuhog ni Benny",
    avatar: "assets\\ronald.jpg",
    userName: "Ronald Weasly",
    reviewDesc: "B E S T  S I S I G  E V E R !!!!!!!!!!!!!!!",
    starRating: 5,
    email: "ronald@gmail.com",
    reviewTitle: "Sisig Forevs",
    images: ["assets\\TNBF3.jpg", "assets\\TNBF4.jpg"],
  });
  const rev6 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "David's Tea House",
    avatar: "assets\\ronald.jpg",
    userName: "Ronald Weasly",
    reviewDesc:
      "I'm a huge fan of Chinese cuisine and all the comforting tastes that I was looking for are found only at David's Teahouse!",
    starRating: 5,
    email: "ronald@gmail.com",
    reviewTitle: "Yummy Chinese",
    images: ["assets\\DT3.jpg", "assets\\DT4.jpg"],
  });

  const rev7 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Starbucks",
    avatar: "assets\\dumbo.jpg",
    userName: "Albus Dumbledore",
    reviewDesc:
      "Service is excellent. Coffee is very nice. The area was very clean. Overall, 5/5.",
    starRating: 5,
    email: "dumbo@gmail.com",
    reviewTitle: "Best Cafe to Stay At!",
    images: ["assets\\SB3.jpg", "assets\\SB4.jpg"],
  });
  const rev8 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Angry Dobo",
    avatar: "assets\\dumbo.jpg",
    userName: "Albus Dumbledore",
    reviewDesc: "Their sizzling delicacies never fails to amaze me!",
    starRating: 5,
    email: "dumbo@gmail.com",
    reviewTitle: "Sizzling all the way!",
    images: ["assets\\AD3.jpg", "assets\\AD4.jpg"],
  });

  const rev9 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Tinuhog ni Benny",
    avatar: "assets\\bilbo.jpg",
    userName: "Bilbo Baggins",
    reviewDesc: "BEST INIHAW PLACE EVERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR!",
    starRating: 5,
    email: "bilbo@gmail.com",
    reviewTitle: "WALA NANG ISASARAP PA!",
    images: ["assets\\TNBF5.jpg", "assets\\TNBF6.jpg"],
  });
  const rev10 = await Reviews.create({
    _id: new mongoose.Types.ObjectId(),
    restaurantName: "Starbucks",
    avatar: "assets\\bilbo.jpg",
    userName: "Bilbo Baggins",
    reviewDesc: "Bad service sometimes but I love their coffee so 3/5.",
    starRating: 3,
    email: "bilbo@gmail.com",
    reviewTitle: "Meh Service",
    images: ["assets\\SB5.jpg", "assets\\SB6.jpg"],
  });
}


// ---------- ROUTES SECTION ---------- //

//app.use(express.static(path.join(_dirname, "./public")));
app.use(express.json());
app.use(routes);
app.listen(3000, () => console.log("Express app is now listening..."));
