
// ---------- Dependencies #1 ---------- //
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
// ---------- Dependencies #1 ---------- //

// ---------- Dependencies #2 ---------- //
const mongoose = require('mongoose');
const connectionString = 'mongodb://127.0.0.1:27017/reviews';

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
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to mongodb');
    })
    .catch((error) => {
        console.error('Error connecting to mongodb:', error);
    });

//Connect to Reviews Schema
const Reviews = require(path.join(__dirname, "./schema/Reviews"));

app.use(express.urlencoded({extended: true}));

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
app.engine('hbs', exphbs.engine({ 
    extname: "hbs",
    helpers: {
        capitalize: function(string) {
            return string.toUpperCase();
        }
    }
}));
app.set("view engine", "hbs");
app.set("views", "./views");

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
        pic4: "static/assets/ADB.png"
    });
});

app.get("/loginPage", (req, res) => {
    res.render("loginPage", {
        title: "When In Taft",
        css1: "static/css/loginStyles.css",
    })
});

app.get("/indexLog", (req, res) => {
    res.render("indexLog", {
        title: "Home",
        script: "static/js/IndexRules.js",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/styles.css",
        css2: "static/css/restaurantStyles.css"
    })
});

app.get("/restaurant", (req, res) => {
    res.render("restaurant", {
        title: "Restaurants",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "restaurantStyles.css",
        css2: "styles.css"
    })
});

/*
<link rel="stylesheet" href="editProfStyles.css" />
    <script src="ViewEstablishmentRules.js" defer></script>
    <link rel="stylesheet" href="ViewEstablishmentStyles.css" />
    <link rel="stylesheet" href="styles.css" />
    <link rel="stylesheet" href="reviewStyles.css" />
*/
app.get("/reviewPage", (req, res) => {
    res.render("reviewPage", {
        title: "User Review Page",
        script: "static/js/ViewEstablishmentRules",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/editProfStyles",
        css2: "static/css/ViewEstablishmentStyles.css",
        css3: "static/css/styles.css",
        css4: "static/css/reviewStyles.css"
    })
});

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

app.post("/reviewPage", (req, res) => {
    //TODO: determine how to get back previous webpage (if galeng kay tnb, dapat tnb)
    //TODO: how to get star rating with the current GUI-like interface of the stars
    const {reviewDesc} = req.body;
    console.log(reviewDesc);

    if (reviewDesc) {
        const review = new Reviews({
            restaurantName: "Angry Dobo",
            userName: "test",
            reviewDesc: reviewDesc,
            starRating: "5.0"
        })
        review.save().then(() => {
            console.log("review submitted")
            res.redirect("RestoView-ADBB")
        })
    } else {
        res.status(400);
        res.redirect("/error");
        console.log("readme")
    }
    
})

app.get("/RestoView-SB", (req, res) => {
    res.render("RestoView-SB", {
        title: "Starbucks",
        script: "static/js/ViewEstablishmentRules.js",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css",
    })
});

app.get("/RestoView-DTH", (req, res) => {
    res.render("RestoView-DTH", {
        title: "David's Tea House",
        script: "static/js/viewProfileRules.js",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css"

    })
});

app.get("/RestoView-ADBB", async (req, res) => {
    try {
      // Query everything that has a restaurant name of "Angry Dobo"
      const reviews = await Reviews.find({ restaurantName: "Angry Dobo" }).lean();
  
      res.render("RestoView-ADBB", {
        title: "Angry Dobo",
        script: "static/js/viewProfileRules.js",
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
  

app.get("/RestoView-ADBB-out", (req, res) => {
    res.render("RestoView-ADBB-out", {
        title: "Angry Dobo",
        script: "static/css/ViewEstablishmentStyles.css",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/StylesOut.css"
    })
});

app.get("/RestoView-TNB", (req, res) => {
    res.render("RestoView-TNB", {
        title: "Tinuhog ni Benny",
        script: "static/js/ViewEstablishmentRules.js",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css"
    })
});

app.get("/registrationPage", (req, res) => {
    res.render("registrationPage", {
        title: "When In Taft",
        css1: "static/css/loginStyles.css"
    })
});

//TODO: get the internal script
app.get("/searchPage", (req, res) => {
    res.render("searchPage", {
        title: "Search Results",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/restaurantStyles.css",
        css2: "statics/css/SearchStyle.css",
        css3: "styles.css"
    })
})

//TODO: get the internal script
app.get("/editProfile", (req, res) => {
    res.render("editProfile", {
        title: "User Review Page",
        script: "static/js/ViewEstablishmentRules.js",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "statics/css/ViewEstablishmentStyles.css",
        css2: "styles.css"
    })
});

app.get("/TNBestablishmentOwnerView", (req, res) => {
    res.render("TNBestablishmentOwnerView", {
        title: "Tinuhog ni Benny",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "ViewEstablishmentStyles.css"
    })
});

app.get("/viewprofileU1", (req, res) => {
    res.render("viewprofileU1", {
        title: "View Profile",
        script: "static/js/ViewProfileRules.js",
        script2: "https://kit.fontawesome.com/78bb10c051.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "styles.css"
    })
});

// ---------- ROUTES SECTION ---------- //


// intercept all requests with the content-type, application/json
//app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));


// Set listener to port 3000
app.listen(3000, () => console.log("Express app is now listening..."));