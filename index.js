// ---------- Dependencies #1 ---------- //
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");

// ---------- Dependencies #1 ---------- //

// ---------- Dependencies #2 ---------- //
const mongoose = require("mongoose");
const upload = require(path.join(__dirname, "./middleware/upload")); //uploading js
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

const dbURL = 'mongodb+srv://whenintaft2:whenintaft2@cluster0.evafs9j.mongodb.net/?retryWrites=true&w=majority';

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(dbURL, connectionParams).then(() => {
  console.info("connected to db");
}).catch((e) => {
  console.log("Error", e);
});


//Connect to Schemas
const Reviews = require(path.join(__dirname, "./schema/Reviews"));
const Users = require(path.join(__dirname, "./schema/Users"));
const Restaurant = require(path.join(__dirname, "./schema/Restaurant"));
const Gallery = require(path.join(__dirname, "./schema/Gallery"));

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
app.use("/static", express.static("public"));

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
//run(); // run only once to get initial contents for the db
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

  //OWNERS
  const user6 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "sb19@gmail.com",
    userName: "Starbucks",
    accountType: "owner",
    password: "sb123",
    userDescription:
      "Indulge in the ultimate coffee experience along with its exceptional brews, comfortable ambiance, and everlasting uniqueness.",
    avatar: "assets/starbucks.jpg",
  });
  const user7 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "tnb123@gmail.com",
    userName: "Tinuhog ni Benny",
    accountType: "owner",
    password: "tnb123",
    userDescription:
      "Experience the mouthwatering savory taste of grilled delicacies that everyone crave for.",
    avatar: "assets/TNB.jpeg",
  });
  const user8 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "dthwho@gmail.com",
    userName: "David's Tea House",
    accountType: "owner",
    password: "dth246",
    userDescription:
      "Let the authentic taste of Chinese cuisine from delicate dim sum to tantalizing stir-fries be at your reach anytime.",
    avatar: "assets/DTH.jpg",
  });
  const user9 = await Users.create({
    _id: new mongoose.Types.ObjectId(),
    email: "angry@gmail.com",
    userName: "Angry Dobo",
    accountType: "owner",
    password: "angry123",
    userDescription:
      "Ignite your senses with one of the all-time Filipino favorite Adobo where every bite is burst of culinary passion.",
    avatar: "assets/ADB.png",
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
  {
    const id = new mongoose.Types.ObjectId();
    const rev1 = await Reviews.create({
      _id: id,
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
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev2 = await Reviews.create({
      _id: id,
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
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev3 = await Reviews.create({
      _id: id,
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
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev4 = await Reviews.create({
      _id: id,
      restaurantName: "Angry Dobo",
      avatar: "assets\\granger.jpg",
      userName: "Hermoine Granger",
      reviewDesc: "For years, they still have the best adobo ever!",
      starRating: 5,
      email: "granger@yahoo.com",
      reviewTitle: "BEST ADOBO PA REN",
      images: ["assets\\AD1.jpg", "assets\\AD2.jpg"],
    });
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev5 = await Reviews.create({
      _id: id,
      restaurantName: "Tinuhog ni Benny",
      avatar: "assets\\ronald.jpg",
      userName: "Ronald Weasly",
      reviewDesc: "B E S T  S I S I G  E V E R !!!!!!!!!!!!!!!",
      starRating: 5,
      email: "ronald@gmail.com",
      reviewTitle: "Sisig Forevs",
      images: ["assets\\TNBF3.jpg", "assets\\TNBF4.jpg"],
    });
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev6 = await Reviews.create({
      _id: id,
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
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev7 = await Reviews.create({
      _id: id,
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
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev8 = await Reviews.create({
      _id: id,
      restaurantName: "Angry Dobo",
      avatar: "assets\\dumbo.jpg",
      userName: "Albus Dumbledore",
      reviewDesc: "Their sizzling delicacies never fails to amaze me!",
      starRating: 5,
      email: "dumbo@gmail.com",
      reviewTitle: "Sizzling all the way!",
      images: ["assets\\AD3.jpg", "assets\\AD4.jpg"],
    });
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev9 = await Reviews.create({
      _id: id,
      restaurantName: "Tinuhog ni Benny",
      avatar: "assets\\bilbo.jpg",
      userName: "Bilbo Baggins",
      reviewDesc: "BEST INIHAW PLACE EVERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR!",
      starRating: 5,
      email: "bilbo@gmail.com",
      reviewTitle: "WALA NANG ISASARAP PA!",
      images: ["assets\\TNBF5.jpg", "assets\\TNBF6.jpg"],
    });
  }
  {
    const id = new mongoose.Types.ObjectId();
    const rev10 = await Reviews.create({
      _id: id,
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
}

// ---- ACCOUNT SWITCH ---- //
class Account {
  constructor(email) {
    this.email = email;
  }

  async init() {
    const user = await Users.findOne({ email: this.email });
    if (user) {
      this.userName = user.userName;
    } else {
      // Handle the case where the email doesn't match any user in the database.
      // For example, you can set a default value for this.userName or throw an error.
      this.userName = "New_User";
      // Or throw an error like this:
      // throw new Error("User not found");
    }
  }
}

async function switchAccount(newAccount) {
  await newAccount.init();
  currentAccount = newAccount;
}

async function deleteReviewFromDatabase(reviewID) {
  try {
    // Find the review by _id and remove it from the database
    await Reviews.deleteOne({ _id: reviewID });
  } catch (error) {
    // Handle any errors that occur during deletion
    console.error("Error deleting review from database:", error);
    throw error;
  }
}

async function deleteReplyFromDatabase(reviewReplyID) {
  try {
    // Delete reviews with the specified reviewReplyID from reviewReplyInfo array
    await Reviews.updateMany(
      { "reviewReplyInfo.repID": reviewReplyID },
      { $pull: { reviewReplyInfo: { repID: reviewReplyID } } }
    );
  } catch (error) {
    // Handle any errors that occur during deletion
    console.error("Error deleting reviews from database:", error);
    throw error;
  }
}
async function updateAverageStarRating(restaurantName) {
  try {
    const reviews = await Reviews.find({ restaurantName });
    if (reviews.length === 0) {
      // No reviews found for the restaurant, set starRating to null or any default value you prefer.
      await Restaurant.updateOne(
        { name: restaurantName },
        { $set: { starRating: null } }
      );
    } else {
      // Calculate the average starRating
      const totalStarRating = reviews.reduce(
        (total, review) => total + review.starRating,
        0
      );
      const averageStarRating = totalStarRating / reviews.length;
      const roundedAverageRating = averageStarRating.toFixed(1); // Round to one decimal place

      // Update the starRating in the Restaurant schema
      await Restaurant.updateOne(
        { name: restaurantName },
        { $set: { starRating: roundedAverageRating } }
      );
    }
  } catch (error) {
    console.error("Error updating average starRating:", error);
  }
}

let currentAccount = new Account("guest@email.com");
let viewUser = new Account("guest@email.com");

// --- ACCOUNT SWITCH --- //

// ---------- ROUTES SECTION ---------- //

app.get("/", async (req, res) => {
  const restaurants = await Restaurant.find().lean();
  console.log(restaurants);

  res.render("index", {
    title: "Home",
    script: "static/js/IndexRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/StylesOut.css",
    script3: "static/css/ViewEstablishmentRules.js",
    css3: "static/css/restaurantStyles.css",
    pic1: "static/assets/starbucks.jpg",
    pic2: "static/assets/DTH.jpg",
    pic3: "static/assets/TNB.jpeg",
    pic4: "static/assets/ADB.png",
    restaurants: restaurants,
  });
});

app.get("/loginPage", (req, res) => {
  res.render("loginPage", {
    title: "When In Taft",
    css1: "static/css/loginStyles.css",
  });
});

app.post("/loginPage", async (req, res) => {
  const { email, pw } = req.body;

  if (email) {
    try {
      const mainUser = await Users.findOne({ email: email });
      if (mainUser != null) {
        const result = await mainUser.comparePW(pw);
        if (result) {
          let account = new Account(email);
          await switchAccount(account);

          res.redirect(`/indexLog?email=${email}`);
          console.log("Logged In");
        } else {
          res.redirect(`/loginPage`);
          console.log("Incorrect PW");
        }
      } else {
        res.status(400);
        res.redirect(`/loginPage`);
        console.log("Email not existing");
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(400);
    res.redirect("/loginPage");
    console.log("readme");
  }
});

app.get("/indexLog", async (req, res) => {
  const restaurants = await Restaurant.find().lean();
  console.log(restaurants);

  try {
    // Query everything that has a restaurant name of "Starbucks"
    // TODO: set query to current user object
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log(user);

    res.render("indexLog", {
      title: "Home",
      script: "static/js/IndexRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/styles.css",
      css2: "static/css/restaurantStyles.css",
      user: user,
      restaurants: restaurants,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/restaurant", async (req, res) => {
  const user = await Users.findOne({ email: currentAccount.email }).lean();
  console.log(user);
  const restaurants = await Restaurant.find().lean();
  console.log(restaurants);

  res.render("restaurant", {
    title: "Restaurants",
    script1: "static/js/RestaurantGridRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/restaurantStyles.css",
    css2: "static/css/styles.css",
    restaurants: restaurants,
    user: user,
  });
});

app.get("/restaurantLogout", async (req, res) => {
  const restaurants = await Restaurant.find().lean();
  console.log(restaurants);

  res.render("restaurantLogout", {
    title: "Restaurants",
    script: "static/js/RestaurantGridRules.js",
    css1: "static/css/restaurantStyles.css",
    css2: "static/css/StylesOut.css",
    restaurants: restaurants,
  });
});

app.get("/reviewPage", async (req, res) => {
  const user = await Users.findOne({ email: currentAccount.email }).lean();
  console.log(user);
  res.render("reviewPage", {
    title: "User Review Page",
    script: "static/js/ViewEstablishmentRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    script3: "static/js/reviewPageRules.js",
    script4: "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js",
    css1: "static/css/editProfStyles.css",
    css2: "static/css/ViewEstablishmentStyles.css",
    css3: "static/css/styles.css",
    css4: "static/css/reviewStyles.css",
    user: user,
  });
});

app.use(express.json());
app.post("/reviewPage", upload.array("images", 2), async (req, res) => {
  //TODO: determine how to get back previous webpage (if galeng kay tnb, dapat tnb)
  //TODO: how to get star rating with the current GUI-like interface of the stars
  const { reviewTitle, reviewDesc, starRating, restaurantName } = req.body;
  console.log("----");
  console.log(reviewTitle);
  console.log(reviewDesc);
  console.log(starRating);
  console.log(restaurantName);
  console.log("----");
  const placeholder = 0;
  let imgs = new Array();

  if (reviewTitle && reviewDesc && starRating && restaurantName) {
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log(user);
    const restoLink = await Restaurant.findOne({ name: restaurantName }).lean();
    console.log(restoLink);
    if (req.files) {
      let origP = "";
      let newP = "";
      req.files.forEach(function (files, index, arr) {
        origP = files.path;
        if (origP.includes("public/")) {
          newP = origP.replace(/public\//g, "");
        } else {
          newP = origP.replace(/public\\/g, "");
        }
        imgs.push(newP);
        const pic = new Gallery({
          link: newP,
          restaurantName: restaurantName,
        });
        pic.save().then(() => {
          console.log("Pic added");
        });
      });

      updateAverageStarRating(restaurantName);
    }
    const newReviewId = new mongoose.Types.ObjectId();
    const review = new Reviews({
      _id: newReviewId,
      email: currentAccount.email,
      restaurantName: restaurantName,
      avatar: user.avatar,
      userName: user.userName,
      reviewDesc: reviewDesc,
      starRating: starRating,
      reviewTitle: reviewTitle,
      images: imgs,
      reactionInfo: {
        likeCount: 1,
      },
    });
    review.save().then(() => {
      console.log("review submitted");
      res.redirect(
        `/restoview?restaurantName=${restaurantName}&editedReview=${newReviewId}`
      );
    });
  } else {
    res.status(400);
    res.redirect("/reviewPage");
    console.log("readme");
  }
});

app.get("/restoview", async (req, res) => {
  try {
    const { restaurantName } = req.query;
    const reviews = await Reviews.find({
      restaurantName: restaurantName,
    }).lean();
    let restaurant = await Restaurant.findOne({ name: restaurantName }).lean();
    console.log(restaurant);

    // Another query to get the highest-rated review for Starbucks
    const highestRated = await Reviews.findOne({
      restaurantName: restaurantName,
    })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    // Gallery
    const gallery = await Gallery.find({
      restaurantName: restaurantName,
    }).lean();

    res.render("restoview", {
      title: restaurantName,
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
      highestRated: highestRated,
      user: user,
      gallery: gallery,
      restaurant,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

// Deletes review when pressed from SB (current)
app.post("/deleteReview", async (req, res) => {
  const { reviewID } = req.body;

  // Call the function to delete the review from the database
  try {
    await deleteReviewFromDatabase(reviewID);
    console.log("Review Successfully Deleted: ", reviewID);
    res.sendStatus(200); // Send a success response to the client
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

app.post("/deleteReply", async (req, res) => {
  const { reviewID } = req.body;

  // Call the function to delete the review from the database
  try {
    await deleteReplyFromDatabase(reviewID);
    console.log("Review Successfully Deleted: ", reviewID);
    res.sendStatus(200); // Send a success response to the client
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

app.post("/restoview", async (req, res) => {
  const { reviewReply, reviewDesc, reviewId, restaurantName } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log(reviewId);
  console.log(restaurantName);
  console.log("----");

  let newRepId = new mongoose.Types.ObjectId();
  Reviews.findOneAndUpdate(
    { _id: reviewId }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: {
          email: currentAccount.email,
          reply: reviewReply,
          user: currentAccount.userName,
          repID: newRepId,
        },
      },
    },
    { new: true } // return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect(
        `/restoview?restaurantName=${restaurantName}&editedReview=${reviewId}`
      );
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.post("/viewprofileRev", async (req, res) => {
  const { reviewReply, reviewDesc, reviewId } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log(reviewId);
  console.log("----");

  Reviews.findOneAndUpdate(
    { _id: reviewId }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: {
          email: currentAccount.email,
          reply: reviewReply,
          user: currentAccount.userName,
        },
      },
    },
    { new: true } // return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect(`/viewprofileU1?editedReview=${reviewId}`);
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.post("/viewOwnerRev", async (req, res) => {
  const { reviewReply, reviewDesc, reviewId } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log(reviewId);
  console.log("----");

  Reviews.findOneAndUpdate(
    { _id: reviewId }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: {
          email: userAccount.email,
          reply: reviewReply,
          user: currentAccount.userName,
        },
      },
    },
    { new: true } // return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect(`/viewOwner?editedReview=${reviewId}`);
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.post("/visitprofileRev", async (req, res) => {
  const { reviewReply, reviewDesc, reviewId, reviewerEmail } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log(reviewId);
  console.log("----");

  Reviews.findOneAndUpdate(
    { _id: reviewId }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: {
          email: userAccount.email,
          reply: reviewReply,
          user: currentAccount.userName,
        },
      },
    },
    { new: true } // return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect(
        `/visitProfile?visitEmail=${reviewerEmail}&editedReview=${reviewId}`
      );
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.get("/resto-out", async (req, res) => {
  try {
    const { restaurantName } = req.query;
    // Query everything that has a restaurant name of "Starbucks"
    const reviews = await Reviews.find({
      restaurantName: restaurantName,
    }).lean();
    const restaurant = await Restaurant.findOne({
      name: restaurantName,
    }).lean();
    console.log("resto-out:", restaurantName);

    // Another query to get the highest-rated review for Starbucks
    const highestRated = await Reviews.findOne({
      restaurantName: restaurantName,
    })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    // Gallery
    const gallery = await Gallery.find({
      restaurantName: restaurantName,
    }).lean();

    res.render("resto-out", {
      title: restaurantName,
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/StylesOut.css",
      reviews: reviews,
      highestRated: highestRated,
      gallery: gallery,
      restaurant: restaurant,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/registrationPage", (req, res) => {
  res.render("registrationPage", {
    title: "When In Taft",
    css1: "static/css/loginStyles.css",
  });
});

app.post("/registrationPage", async (req, res) => {
  const { email, pw, confirm } = req.body;

  if (email) {
    try {
      const mainEmail = await Users.findOne({ email: email });
      if (pw === confirm && mainEmail == null) {
        const newUser = new Users({
          _id: new mongoose.Types.ObjectId(),
          email: email,
          userName: "New_User",
          accountType: "viewer",
          password: pw,
          userDescription: "No Description Added Yet.",
          avatar: "assets\\anonymous_picture.png",
        });

        let account = new Account(email);
        await switchAccount(account);

        newUser.save().then(() => {
          console.log("new user added");
          res.redirect(`/editProfile?email=${email}`);
        });
      } else {
        res.status(400);
        res.redirect("/registrationPage");
        console.log("No user added");
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(400);
    res.redirect("/registrationPage");
    console.log("readme");
  }
});

app.get("/searchPage", async (req, res) => {
  try {
    const { keyword, filterOptions } = req.query;
    console.log(filterOptions);
    console.log(keyword);

    // Initialize the filter object
    const filter = {};

    // Add the keyword filter if it is defined
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    // If keyword is not defined in the query parameters, check if it is present in the link
    if (!keyword && req.url.includes("?keyword=")) {
      const startIndex = req.url.indexOf("?keyword=") + 9; // Length of "?keyword="
      const endIndex = req.url.indexOf("&", startIndex);
      if (endIndex === -1) {
        // If there's no '&' after the keyword, extract the keyword until the end of the URL
        filter.name = { $regex: req.url.slice(startIndex), $options: "i" };
      } else {
        // Extract the keyword between the '?' and '&' symbols
        filter.name = {
          $regex: req.url.slice(startIndex, endIndex),
          $options: "i",
        };
      }
    }

    // Query all restos that match the filter criteria
    let restaurants = await Restaurant.find(filter).lean();

    // Apply sorting based on the filter value (if provided)
    if (filterOptions === "HighestToLowestRating") {
      restaurants.sort((a, b) => b.starRating - a.starRating);
    } else if (filterOptions === "LowestToHighestRating") {
      restaurants.sort((a, b) => a.starRating - b.starRating);
    }

    res.render("searchPage", {
      title: "Search Results",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      script3: "static/js/SearchPage.js",
      css1: "static/css/restaurantStyles.css",
      css2: "static/css/SearchStyle.css",
      css3: "static/css/styles.css",
      restaurants: restaurants,
      keyword: keyword,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.post("/searchPage", (req, res) => {
  const { keyword } = req.body;

  console.log(keyword);
  if (keyword) {
    console.log("search submitted");
    res.redirect(`/searchPage?keyword=${keyword}`);
  } else {
    res.status(400);
    res.redirect("/error");
    console.log("readme");
  }
});

app.post("/searchPageFilter", (req, res) => {
  const { keyword, filterOptions } = req.body;

  console.log(filterOptions);
  console.log(keyword);

  if (filterOptions === "HighestToLowestRating") {
    res.redirect(
      `/searchPage?filterOptions=${filterOptions}&keyword=${keyword}`
    );
  } else if (filterOptions === "LowestToHighestRating") {
    res.redirect(
      `/searchPage?filterOptions=${filterOptions}&keyword=${keyword}`
    );
  } else {
    // Handle any other case (optional)
    console.log("Invalid selection or no selection");
    // Redirect back to the search page without filtering
    res.redirect(`/searchPage?keyword=${keyword}`);
  }
});

app.post("/searchPageLogoutFilter", (req, res) => {
  const { keyword, filterOptions } = req.body;

  console.log(filterOptions);
  console.log(keyword);

  if (filterOptions === "HighestToLowestRating") {
    res.redirect(
      `/searchPageLogout?filterOptions=${filterOptions}&keyword=${keyword}`
    );
  } else if (filterOptions === "LowestToHighestRating") {
    res.redirect(
      `/searchPageLogout?filterOptions=${filterOptions}&keyword=${keyword}`
    );
  } else {
    // Handle any other case (optional)
    console.log("Invalid selection or no selection");
    // Redirect back to the search page without filtering
    res.redirect(`/searchPageLogout?keyword=${keyword}`);
  }
});

app.get("/searchPageLogout", async (req, res) => {
  try {
    const { keyword, filterOptions } = req.query;
    console.log(filterOptions);
    console.log(keyword);

    // Initialize the filter object
    const filter = {};

    // Add the keyword filter if it is defined
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    // If keyword is not defined in the query parameters, check if it is present in the link
    if (!keyword && req.url.includes("?keyword=")) {
      const startIndex = req.url.indexOf("?keyword=") + 9; // Length of "?keyword="
      const endIndex = req.url.indexOf("&", startIndex);
      if (endIndex === -1) {
        // If there's no '&' after the keyword, extract the keyword until the end of the URL
        filter.name = { $regex: req.url.slice(startIndex), $options: "i" };
      } else {
        // Extract the keyword between the '?' and '&' symbols
        filter.name = {
          $regex: req.url.slice(startIndex, endIndex),
          $options: "i",
        };
      }
    }

    // Query all restos that match the filter criteria
    let restaurants = await Restaurant.find(filter).lean();

    // Apply sorting based on the filter value (if provided)
    if (filterOptions === "HighestToLowestRating") {
      restaurants.sort((a, b) => b.starRating - a.starRating);
    } else if (filterOptions === "LowestToHighestRating") {
      restaurants.sort((a, b) => a.starRating - b.starRating);
    }

    res.render("searchPageLogout", {
      title: "Search Results",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      script3: "static/js/SearchPage.js",
      css1: "static/css/restaurantStyles.css",
      css2: "static/css/SearchStyle.css",
      css3: "static/css/styles.css",
      restaurants: restaurants,
      keyword: keyword,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.post("/searchPageLogout", (req, res) => {
  const { keyword } = req.body;

  console.log(keyword);
  if (keyword) {
    console.log("search submitted");
    res.redirect(`/searchPageLogout?keyword=${keyword}`);
  } else {
    res.status(400);
    res.redirect("/error");
    console.log("readme");
  }
});

app.get("/editProfile", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Starbucks"
    // TODO: set query to current user object
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log(user);

    res.render("editProfile", {
      title: "Edit Profile",
      script1: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "/static/css/editProfStyles.css",
      css2: "static/css/ViewEstablishmentStyles.css",
      css3: "static/css/styles.css",
      user: user,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

// ...

app.post("/editProfile", upload.single("avatar"), async (req, res) => {
  const email = currentAccount.email;
  console.log(email);

  const { userName, userDescription } = req.body;
  console.log(userName);
  console.log(userDescription);
  let img = null;

  if (userName && userDescription) {
    // Update query for the user's avatar
    if (req.file) {
      let fileName = req.file.path;
      if (fileName.includes("public/")) {
        img = fileName.replace(/public\//g, "");
      } else {
        img = fileName.replace(/public\\/g, "");
      }

      try {
        const updatedUser = await Users.findOneAndUpdate(
          { email: email },
          { userName: userName, userDescription: userDescription, avatar: img },
          { new: true }
        );

        if (!updatedUser) {
          console.log("User not found!");
          return res.status(404).json({ error: "User not found" });
        }
        console.log("User updated:", updatedUser);
      } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Error updating user" });
        return;
      }
    } else {
      // Update query for the user's information without avatar
      try {
        const updatedUser = await Users.findOneAndUpdate(
          { email: email },
          { userName: userName, userDescription: userDescription },
          { new: true }
        );

        if (!updatedUser) {
          console.log("User not found!");
          return res.status(404).json({ error: "User not found" });
        }
        console.log("User updated:", updatedUser);
      } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Error updating user" });
        return;
      }
    }

    try {
      // Update reviews if there are any associated with the user's email
      await Reviews.updateMany(
        { email: email },
        { $set: { userName: userName } }
      );

      if (req.file) {
        await Reviews.updateMany(
          { email: email },
          { $set: { avatar: img } }
        );
      }

      // Update all occurrences of the matching email in reviewReplyInfo
      await Reviews.updateMany(
        { "reviewReplyInfo.email": email },
        { $set: { "reviewReplyInfo.$[elem].user": userName } },
        { arrayFilters: [{ "elem.email": email }] }
      );

      console.log("Reviews updated.");

      // Redirect to the user's profile page:
      res.redirect("/viewprofileU1");
      let account = new Account(email);
      switchAccount(account);
    } catch (err) {
      console.error("Error updating reviews:", err);
      res.status(500).json({ error: "Error updating reviews" });
    }
  } else {
    res.status(400);
    res.redirect("/editProfile");
    console.log("Invalid request");
  }
});

app.get("/viewprofileU1", async (req, res) => {
  //query here
  try {
    // Query everything that has a restaurant name of "Starbucks"
    // TODO: set query to current user object
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log(user);
    const reviews = await Reviews.find({ email: currentAccount.email }).lean();
    console.log(reviews);
    console.log("done");

    res.render("viewprofileU1", {
      title: "View Profile",
      script: "static/js/ViewProfileRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      user: user,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
  //
});

app.get("/viewOwner", async (req, res) => {
  //query here
  try {
    // Query everything that has a restaurant name of "Starbucks"
    // TODO: set query to current user object
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log(user);
    const reviews = await Reviews.find({
      restaurantName: user.userName,
    }).lean();
    console.log(reviews);
    console.log("done");

    res.render("viewOwner", {
      title: user.userName,
      script: "static/js/ViewProfileRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      user: user,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
  //
});

app.get("/editRestaurant", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Starbucks"
    // TODO: set query to current user object
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log(user);

    res.render("editRestaurant", {
      title: "Edit Restaurant",
      script1: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "/static/css/editProfStyles.css",
      css2: "static/css/ViewEstablishmentStyles.css",
      css3: "static/css/styles.css",
      user: user,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.post("/editRestaurant", upload.single("avatar"), (req, res) => {
  email = currentAccount.email;
  let prevName = currentAccount.userName;
  console.log(email);

  const { userName, userDescription } = req.body;
  console.log(userName);
  console.log(userDescription);
  let img = null;

  if (userName && userDescription) {
    //update query
    if (req.file) {
      let fileName = req.file.path;
      if (fileName.includes("public/")) {
        img = fileName.replace(/public\//g, "");
      } else {
        img = fileName.replace(/public\\/g, "");
      }

      Users.findOneAndUpdate(
        { email: email }, //find based on matching email
        { avatar: img },
        { new: true } // return the updated document
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            console.log("User not found!");
            return res.status(404).json({ error: "User not found" });
          }
          console.log("Avatar updated:", updatedUser);
        })
        .catch((err) => {
          console.error("Error updating user:", err);
          res.status(500).json({ error: "Error updating user" });
        });
      Restaurant.findOneAndUpdate(
        { name: prevName }, //find based on matching email
        { img: img },
        { new: true } // return the updated document
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            console.log("Resto not found!");
            return res.status(404).json({ error: "Resto not found" });
          }
          console.log("RestoPic updated:", updatedUser);
        })
        .catch((err) => {
          console.error("Error updating Resto", err);
          res.status(500).json({ error: "Error updating Resto" });
        });
    }
    Users.findOneAndUpdate(
      { email: email }, //find based on matching email
      { userName: userName, userDescription: userDescription },
      { new: true } // return the updated document
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          console.log("User not found!");
          return res.status(404).json({ error: "User not found" });
        }
        console.log("User updated:", updatedUser);
        //update reviews if there is:
        Restaurant.findOneAndUpdate(
          { name: prevName }, //find based on matching email
          { name: userName, desc: userDescription },
          { new: true } // return the updated document
        )
          .then((updatedUser) => {
            if (!updatedUser) {
              console.log("Resto not found!");
              return res.status(404).json({ error: "Resto not found" });
            }
            console.log("RestoPic updated:", updatedUser);
          })
          .catch((err) => {
            console.error("Error updating Resto", err);
            res.status(500).json({ error: "Error updating Resto" });
          });
        const reviews = Reviews.find({ restaurantName: prevName }).lean();
        if (reviews) {
          Reviews.updateMany(
            { restaurantName: prevName },
            { restaurantName: userName }
          )
            .then((updatedReviews) => {
              if (!updatedReviews) {
                console.log("Review not found!");
                return res.status(404).json({ error: "Reviews not Found" });
              }
              console.log("Review updated:", updatedReviews);
            })
            .catch((err) => {
              console.error("Error updating reviews:", err);
              res.status(500).json({ error: "Error updating reviews" });
            });
        }
        const gallery = Gallery.find({ restaurantName: prevName }).lean();
        if (gallery) {
          Gallery.updateMany(
            { restaurantName: prevName },
            { restaurantName: userName }
          )
            .then((updatedReviews) => {
              if (!updatedReviews) {
                console.log("Pics not found!");
                return res.status(404).json({ error: "Pics not Found" });
              }
              console.log("Review updated:", updatedReviews);
            })
            .catch((err) => {
              console.error("Error updating gallery:", err);
              res.status(500).json({ error: "Error updating gallery" });
            });
        }

        // redirect to the user's profile page:
        res.redirect("/viewOwner");
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Error updating user" });
      });
  } else {
    res.status(400);
    res.redirect("/editRestaurant");
    console.log("Invalid request");
  }
});

app.get("/visitProfile", async (req, res) => {
  //query here
  try {
    const { visitEmail } = req.query;
    console.log("visitPROFILE: ", visitEmail);
    // Query everything that has a restaurant name of "Starbucks"
    // TODO: set query to current user object
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    console.log("User: ", user);
    const reviews = await Reviews.find({ email: visitEmail }).lean();
    console.log("Reviews: ", reviews);
    const visit = await Users.findOne({ email: visitEmail }).lean();
    console.log("Visit Email: ", visit);
    console.log("done");

    res.render("visitProfile", {
      title: "View Profile",
      script: "static/js/viewProfileRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      visit: visit,
      user: user,
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
  //
});

app.use(express.json());
app.post("/reactionPost", async (req, res) => {
  const { dataId, countL, toggled } = req.body;
  console.log("HERE I AM");
  console.log(countL);
  console.log(dataId);
  console.log(toggled);

  if (dataId !== undefined) {
    // Check if toggled is defined (to handle both checked and unchecked cases)
    Reviews.findByIdAndUpdate(
      dataId,
      {
        $set: {
          "reactionInfo.likeCount": countL,
        }, // Use $set to update the specific field
      },
      { new: true } // Return the updated document
    )
      .then((updatedReview) => {
        if (!updatedReview) {
          console.log("Review not found!");
          return res.status(404).json({ error: "Review not found" });
        }
        console.log("Review updated:", updatedReview);
        // Redirect to the resto view:
        res.status(200);
      })
      .catch((err) => {
        console.error("Error updating review:", err);
        res.status(500).json({ error: "Error updating review" });
      });

    // Get the ObjectID of the user based on their email
    Users.findOne({ email: currentAccount.email })
      .then((document) => {
        if (!document) {
          console.log("User document not found.");
          return res.status(404).json({ error: "User document not found" });
        }

        const objectId = document._id; // Assign the ObjectId here
        console.log("Found ObjectID:", objectId);

        if (toggled == 1) {
          // If toggled is 1, push dataId to likedPost
          Users.findByIdAndUpdate(
            objectId,
            {
              $addToSet: {
                likedPost: dataId,
              },
            },
            { new: true }
          )
            .then((updatedDocument) => {
              if (updatedDocument) {
                console.log("ObjectID added to likedPost:", dataId);
              } else {
                console.log("Document not found: ", objectId);
              }
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        } else if (toggled == 0) {
          // If toggled is 0, remove dataId from likedPost if it exists
          Users.findByIdAndUpdate(
            objectId,
            {
              $pull: {
                likedPost: dataId,
              },
            },
            { new: true }
          )
            .then((updatedDocument) => {
              if (updatedDocument) {
                console.log("ObjectID removed from likedPost:", dataId);
                // Decrease likeCount in Reviews by 1
                Reviews.findByIdAndUpdate(
                  dataId,
                  {
                    $inc: {
                      "reactionInfo.likeCount": -1,
                    },
                  },
                  { new: true }
                )
                  .then((updatedReview) => {
                    if (updatedReview) {
                      console.log("Review likeCount decreased:", updatedReview);
                    } else {
                      console.log("Review not found!");
                    }
                  })
                  .catch((error) => {
                    console.error("Error updating review:", error);
                  });
              } else {
                console.log("Document not found: ", objectId);
              }
            })
            .catch((error) => {
              console.error("Error updating document:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error finding user document:", error);
        return res.status(500).json({ error: "Error finding user document" });
      });
  }
});

app.get("/loadReactionPost", async (req, res) => {
  const ID = req.query.ID;
  console.log("USER ID PRINT: ", ID);

  Users.findOne({ email: currentAccount.email })
    .then((document) => {
      if (!document) {
        console.log("User document not found.");
        return res.status(404).json({ error: "User document not found" });
      }

      const userId = document._id; // Assign the ObjectId here
      console.log("Found ObjectID:", userId);

      const reviewId = ID; // The ObjectId you want to check

      Users.findOne({ _id: userId, likedPost: { $in: [reviewId] } })
        .then((user) => {
          if (user) {
            console.log("Review is liked by the user.");
            return res.json({ liked: true });
          } else {
            console.log("Review is not liked by the user.");
            return res.json({ liked: false });
          }
        })
        .catch((error) => {
          console.error("Error searching user:", error);
          return res.status(500).json({ error: "Error searching user" });
        });
    })
    .catch((error) => {
      console.error("Error finding user document:", error);
      return res.status(500).json({ error: "Error finding user document" });
    });
});

app.get("/loadReactionPostMin", async (req, res) => {
  const ID = req.query.ID;
  console.log("USER ID PRINT: ", ID);

  try {
    const review = await Reviews.findById(ID);

    if (!review) {
      console.log("Review not found.");
      return res.status(404).json({ error: "Review not found" });
    }

    // Accessing likeCount from the review
    const likeCount = review.reactionInfo.likeCount;
    console.log("Like Count:", likeCount);

    // Send the likeCount as a response
    return res.json({ likeCount });
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ error: "Error fetching review" });
  }
});

app.post("/editReview", async (req, res) => {
  const { editRevBox, reviewID } = req.body;
  console.log(reviewID);

  Reviews.findByIdAndUpdate(
    reviewID,
    {
      $set: {
        reviewDesc: editRevBox,
        isEdited: true,
      }, // Use $set to update the specific field
    },
    { new: true } // Return the updated document
  )
    .then(async (updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);

      const reviews = await Reviews.findById(reviewID);

      // Accessing likeCount from the review
      const restaurantName = reviews.restaurantName;
      console.log("REST NAME", restaurantName);

      // Redirect to the resto view:
      res.redirect(
        `/restoview?restaurantName=${restaurantName}&editedReview=${reviewID}`
      );
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.post("/editReviewVP", async (req, res) => {
  const { editRevBox, reviewID } = req.body;
  console.log(reviewID);

  Reviews.findByIdAndUpdate(
    reviewID,
    {
      $set: {
        reviewDesc: editRevBox,
        isEdited: true,
      }, // Use $set to update the specific field
    },
    { new: true } // Return the updated document
  )
    .then(async (updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);

      const reviews = await Reviews.findById(reviewID);

      // Accessing likeCount from the review
      const restaurantName = reviews.restaurantName;
      console.log("REST NAME", restaurantName);

      // Redirect to the resto view:
      res.redirect(`/viewprofileU1?editedReview=${reviewID}`);
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.get("/updateRestoDOM", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().lean();
    console.log(restaurants);

    for (const restaurant of restaurants) {
      console.log(restaurant.name);
      await updateAverageStarRating(restaurant.name);
    }

    res
      .status(200)
      .json({ message: "Average star ratings updated for all restaurants" });
  } catch (error) {
    console.error("Error updating average star ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------- ROUTES SECTION ---------- //

// intercept all requests with the content-type, application/json
//app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Set listener to port 3000
app.listen(3000, () => console.log("Express app is now listening..."));
