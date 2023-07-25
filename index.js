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
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => {
    console.error("Error connecting to mongodb:", error);
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
//run(); // run only once
async function run() {
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
  console.log(restaurant1);
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

async function deleteReviewFromDatabase(reviewDesc) {
  try {
    // Find the review by reviewDesc and remove it from the database
    await Reviews.findOneAndDelete({ reviewDesc });
  } catch (error) {
    // Handle any errors that occur during deletion
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
    css2: "static/css/ViewEstablishmentRules.js",
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
      res.redirect(restoLink.link);
    });
  } else {
    res.status(400);
    res.redirect("/reviewPage");
    console.log("readme");
  }
});

app.get("/RestoView-SB", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Starbucks"
    const reviews = await Reviews.find({ restaurantName: "Starbucks" }).lean();
    // Another query to get the highest-rated review for Starbucks
    const highestRated = await Reviews.findOne({ restaurantName: "Starbucks" })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    // Gallery
    const gallery = await Gallery.find({ restaurantName: "Starbucks" }).lean();
    console.log(user);
    console.log(reviews);

    res.render("RestoView-SB", {
      title: "Starbucks",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
      highestRated: highestRated,
      user: user,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

// Deletes review when pressed from SB (current)
app.post("/deleteReview", async (req, res) => {
  const { reviewDesc } = req.body;

  // Call the function to delete the review from the database
  try {
    await deleteReviewFromDatabase(reviewDesc);
    console.log("Review Successfully Deleted");
    res.sendStatus(200); // Send a success response to the client
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

app.post("/RestoView-SB", async (req, res) => {
  const { reviewReply, reviewDesc, currentUser } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log("----");

  //TODO: this should use an id, not a matching description
  Reviews.findOneAndUpdate(
    { reviewDesc: reviewDesc }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: { reply: reviewReply, user: currentAccount.userName },
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
      res.redirect("RestoView-SB");
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.get("/RestoView-SB-out", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Starbucks"
    const reviews = await Reviews.find({ restaurantName: "Starbucks" }).lean();

    // Another query to get the highest-rated review for Starbucks
    const highestRated = await Reviews.findOne({ restaurantName: "Starbucks" })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    // Gallery
    const gallery = await Gallery.find({ restaurantName: "Starbucks" }).lean();

    res.render("RestoView-SB-out", {
      title: "Starbucks",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/stylesOut.css",
      reviews: reviews,
      highestRated: highestRated,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-DTH", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "David's Tea House"
    const reviews = await Reviews.find({
      restaurantName: "David's Tea House",
    }).lean();

    // Another query to get the highest-rated review for David's Tea House
    const highestRated = await Reviews.findOne({
      restaurantName: "David's Tea House",
    })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    //Gallery
    const gallery = await Gallery.find({
      restaurantName: "David's Tea House",
    }).lean();
    console.log(user);

    res.render("RestoView-DTH", {
      title: "David's Tea House",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
      highestRated: highestRated,
      user: user,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.post("/RestoView-DTH", async (req, res) => {
  const { reviewReply, reviewDesc } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log("----");

  //TODO: this should use an id, not a matching description
  Reviews.findOneAndUpdate(
    { reviewDesc: reviewDesc }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: { reply: reviewReply, user: currentAccount.userName },
      },
    },
    { new: true } //return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect("RestoView-DTH");
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.get("/RestoView-DTH-out", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "David's Tea House"
    const reviews = await Reviews.find({
      restaurantName: "David's Tea House",
    }).lean();

    // Another query to get the highest-rated review for "David's Tea House"
    const highestRated = await Reviews.findOne({
      restaurantName: "David's Tea House",
    })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    //Gallery
    const gallery = await Gallery.find({
      restaurantName: "David's Tea House",
    }).lean();

    res.render("RestoView-DTH-out", {
      title: "David's Tea House",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/StylesOut.css",
      reviews: reviews,
      highestRated: highestRated,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-ADB", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Angry Dobo"
    const reviews = await Reviews.find({ restaurantName: "Angry Dobo" }).lean();

    // Another query to get the highest-rated review for "Angry Dobo"
    const highestRated = await Reviews.findOne({ restaurantName: "Angry Dobo" })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    const user = await Users.findOne({ email: currentAccount.email }).lean();
    //Gallery
    const gallery = await Gallery.find({ restaurantName: "Angry Dobo" }).lean();
    console.log(user);

    res.render("RestoView-ADB", {
      title: "Angry Dobo",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews, // Pass the reviews object to the template
      highestRated: highestRated,
      user: user,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.post("/RestoView-ADB", async (req, res) => {
  const { reviewReply, reviewDesc } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log("----");

  //TODO: this should use an id, not a matching description
  Reviews.findOneAndUpdate(
    { reviewDesc: reviewDesc }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: { reply: reviewReply, user: currentAccount.userName },
      },
    },
    { new: true } //return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect("RestoView-ADB");
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.get("/RestoView-ADB-out", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Angry Dobo"
    const reviews = await Reviews.find({ restaurantName: "Angry Dobo" }).lean();

    // Another query to get the highest-rated review for Starbucks
    const highestRated = await Reviews.findOne({ restaurantName: "Angry Dobo" })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();
    //Gallery
    const gallery = await Gallery.find({ restaurantName: "Angry Dobo" }).lean();

    res.render("RestoView-ADB-out", {
      title: "Angry Dobo",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/StylesOut.css",
      reviews: reviews,
      highestRated: highestRated,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-TNB", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Tinuhog ni Benny"
    const reviews = await Reviews.find({
      restaurantName: "Tinuhog ni Benny",
    }).lean();

    // Another query to get the highest-rated review for "Tinuhog ni Benny"
    const highestRated = await Reviews.findOne({
      restaurantName: "Tinuhog ni Benny",
    })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();

    const user = await Users.findOne({ email: currentAccount.email }).lean();
    //Gallery
    const gallery = await Gallery.find({
      restaurantName: "Tinuhog ni Benny",
    }).lean();
    console.log(user);

    res.render("RestoView-TNB", {
      title: "Tinuhog ni Benny",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
      highestRated: highestRated,
      user: user,
      gallery: gallery,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.post("/RestoView-TNB", async (req, res) => {
  const { reviewReply, reviewDesc } = req.body;
  console.log("----");
  console.log(reviewReply);
  console.log(reviewDesc);
  console.log("----");

  //TODO: this should use an id, not a matching description
  Reviews.findOneAndUpdate(
    { reviewDesc: reviewDesc }, // find the matching reviewDesc
    {
      $push: {
        reviewReplyInfo: { reply: reviewReply, user: currentAccount.userName },
      },
    },
    { new: true } //return the updated document
  )
    .then((updatedReview) => {
      if (!updatedReview) {
        console.log("Review not found!");
        return res.status(404).json({ error: "Review not found" });
      }
      console.log("Review updated:", updatedReview);
      // redirect to the resto view:
      res.redirect("RestoView-TNB");
    })
    .catch((err) => {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Error updating review" });
    });
});

app.get("/RestoView-TNB-out", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Tinuhog ni Benny"
    const reviews = await Reviews.find({
      restaurantName: "Tinuhog ni Benny",
    }).lean();

    // Another query to get the highest-rated review for "Tinuhog ni Benny"
    const highestRated = await Reviews.findOne({
      restaurantName: "Tinuhog ni Benny",
    })
      .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
      .limit(1) // Limit the result to one review
      .lean();

    //Gallery
    const gallery = await Gallery.find({
      restaurantName: "Tinuhog ni Benny",
    }).lean();

    res.render("RestoView-TNB-out", {
      title: "Tinuhog ni Benny",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/StylesOut.css",
      reviews: reviews,
      highestRated: highestRated,
      gallery: gallery,
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
      title: "User Review Page",
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

app.post("/editProfile", upload.single("avatar"), (req, res) => {
  email = currentAccount.email;
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
        // redirect to the user's profile page:
        res.redirect("/viewprofileU1");
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Error updating user" });
      });
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

app.get("/visitProfile", async (req, res) => {
  const { visitEmail } = req.query;
  console.log(visitEmail);
  //query here
  try {
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
      script: "static/js/ViewProfileRules.js",
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
  const { dataId, toggled, count } = req.body;
  console.log("HERE I AM");
  console.log(toggled);
  console.log(count);
  console.log(dataId);

  if (toggled !== undefined) {
    // Check if toggled is defined (to handle both checked and unchecked cases)
    Reviews.findByIdAndUpdate(
      dataId,
      {
        $set: {
          "reactionInfo.likeToggle": toggled,
          "reactionInfo.likeCount": count,
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
        res.redirect("RestoView-DTH");
      })
      .catch((err) => {
        console.error("Error updating review:", err);
        res.status(500).json({ error: "Error updating review" });
      });
  }
});

// ---------- ROUTES SECTION ---------- //

// intercept all requests with the content-type, application/json
//app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Set listener to port 3000
app.listen(3000, () => console.log("Express app is now listening..."));
