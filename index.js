// ---------- Dependencies #1 ---------- //
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
// ---------- Dependencies #1 ---------- //

// ---------- Dependencies #2 ---------- //
const mongoose = require("mongoose");
const connectionString = "mongodb://127.0.0.1:27017/reviews";

//CAUTION: UNCOMMENT TO DROP SCHEMA DATA
/*
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to mongodb');
    // Drop the Reviews collection
    return Reviews.collection.drop();
  })
  .then(() => {
    console.log('The Reviews collection has been dropped.');
    // Optionally, you can close the connection after the operation is done.
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to mongodb:', error);
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

app.use(express.urlencoded({ extended: true }));

/* ---------- SAMPLE CODE OF HOW TO PUSH DATA TO SCHEMA ---------- 
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
---------- SAMPLE CODE OF HOW TO PUSH DATA TO SCHEMA ---------- */

// ---------- Dependencies #2 ---------- //

// Set views folder to 'public' for accessibility
app.use("/static", express.static("public"));

// State hbs as view engine and views folder for views
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    helpers: {
      capitalize: function (string) {
        return string.toUpperCase();
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

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

let currentAccount = new Account("guest@email.com");

// --- ACCOUNT SWITCH --- //

// ---------- ROUTES SECTION ---------- //

app.get("/", (req, res) => {
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
    res.redirect("/error");
    console.log("readme");
  }
});

app.get("/indexLog", (req, res) => {
  res.render("indexLog", {
    title: "Home",
    script: "static/js/IndexRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/styles.css",
    css2: "static/css/restaurantStyles.css",
  });
});

app.get("/restaurant", (req, res) => {
  res.render("restaurant", {
    title: "Restaurants",
    script1: "static/js/RestaurantGridRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/restaurantStyles.css",
    css2: "static/css/styles.css",
  });
});

app.get("/restaurantLogout", (req, res) => {
  res.render("restaurantLogout", {
    title: "Restaurants",
    script: "static/js/RestaurantGridRules.js",
    css1: "static/css/restaurantStyles.css",
    css2: "static/css/StylesOut.css",
  });
});

app.get("/reviewPage", (req, res) => {
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
  });
});

app.use(express.json());
app.post("/reviewPagePost", async (req, res) => {
  //TODO: determine how to get back previous webpage (if galeng kay tnb, dapat tnb)
  //TODO: how to get star rating with the current GUI-like interface of the stars
  const { reviewTitle, reviewDesc, starRating, restaurantName } = req.body;
  console.log("----")
  console.log(reviewTitle);
  console.log(reviewDesc);
  console.log(starRating);
  console.log(restaurantName);
  console.log("----")

  if (reviewTitle && reviewDesc && starRating && restaurantName) {
    const review = new Reviews({
      email: currentAccount.email,
      restaurantName: restaurantName,
      userName: currentAccount.userName,
      reviewDesc: reviewDesc,
      starRating: starRating,
      reviewTitle: reviewTitle
    });
    review.save().then(() => {
      console.log("review submitted");
      res.redirect("RestoView-ADBB");
    });
  } else {
    res.status(400);
    res.redirect("/error");
    console.log("readme");
  }
});

app.get("/RestoView-SB", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Starbucks"
    const reviews = await Reviews.find({ restaurantName: "Starbucks" }).lean();

    res.render("RestoView-SB", {
      title: "Starbucks",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-SB-out", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Angry Dobo"
    const reviews = await Reviews.find({
      restaurantName: "David's Tea House",
    }).lean();

    res.render("RestoView-SB-out", {
      title: "Starbucks",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/StylesOut.css",
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-DTH", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Angry Dobo"
    const reviews = await Reviews.find({
      restaurantName: "David's Tea House",
    }).lean();

    res.render("RestoView-DTH", {
      title: "David's Tea House",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-DTH-out", (req, res) => {
  res.render("RestoView-DTH-out", {
    title: "David's Tea House",
    script: "static/js/ViewEstablishmentRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/ViewEstablishmentStyles.css",
    css2: "static/css/StylesOut.css",
  });
});

app.get("/RestoView-ADBB", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Angry Dobo"
    const reviews = await Reviews.find({ restaurantName: "Angry Dobo" }).lean();

    res.render("RestoView-ADBB", {
      title: "Angry Dobo",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews, // Pass the reviews object to the template
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-ADB-out", (req, res) => {
  res.render("RestoView-ADB-out", {
    title: "Angry Dobo",
    script: "static/js/ViewEstablishmentRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/ViewEstablishmentStyles.css",
    css2: "static/css/StylesOut.css",
  });
});

app.get("/RestoView-TNB", async (req, res) => {
  try {
    // Query everything that has a restaurant name of "Angry Dobo"
    const reviews = await Reviews.find({
      restaurantName: "Tinuhog ni Benny",
    }).lean();

    res.render("RestoView-TNB", {
      title: "Tinuhog ni Benny",
      script: "static/js/ViewEstablishmentRules.js",
      script2: "https://kit.fontawesome.com/78bb10c051.js",
      css1: "static/css/ViewEstablishmentStyles.css",
      css2: "static/css/styles.css",
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error querying reviews:", error);
    res.status(500).send("Error querying reviews");
  }
});

app.get("/RestoView-TNB-out", (req, res) => {
  res.render("RestoView-TNB-out", {
    title: "Tinuhog ni Benny",
    script: "static/js/ViewEstablishmentRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "static/css/ViewEstablishmentStyles.css",
    css2: "static/css/StylesOut.css",
  });
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
    res.redirect("/error");
    console.log("readme");
  }
});

app.get("/searchPage", (req, res) => {
  res.render("searchPage", {
    title: "Search Results",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    script3: "static/js/SearchPage.js",
    css1: "static/css/restaurantStyles.css",
    css2: "static/css/SearchStyle.css",
    css3: "static/css/styles.css",
  });
});

app.get("/searchPageLogout", (req, res) => {
  res.render("searchPageLogout", {
    title: "Search Results",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    script3: "static/js.SearchPageLogout.js",
    css1: "static/css/restaurantStyles.css",
    css2: "static/css/SearchStyle.css",
    css3: "static/css/StylesOut.css",
  });
});

app.get("/editProfile", (req, res) => {
  const email = req.query.email;

  res.render("editProfile", {
    title: "User Review Page",
    script1: "static/js/ViewEstablishmentRules.js",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    css1: "/static/css/editProfStyles.css",
    css2: "static/css/ViewEstablishmentStyles.css",
    css3: "static/css/styles.css",
    email: email,
  });
});

app.post("/editProfile", (req, res) => {
  email = currentAccount.email;
  console.log(email);

  const { userName, userDescription } = req.body;
  console.log(userName);
  console.log(userDescription);

  if (userName && userDescription) {
    //update query
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
    res.redirect("/error");
    console.log("Invalid request");
  }
});

app.get("/TNBestablishmentOwnerView", (req, res) => {
  res.render("TNBestablishmentOwnerView", {
    title: "Tinuhog ni Benny",
    script2: "https://kit.fontawesome.com/78bb10c051.js",
    script3: "static/js/TNBestablishmentOwnerView.js",
    css1: "static/css/ViewEstablishmentStyles.css",
  });
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

// ---------- ROUTES SECTION ---------- //

// intercept all requests with the content-type, application/json
//app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Set listener to port 3000
app.listen(3000, () => console.log("Express app is now listening..."));
