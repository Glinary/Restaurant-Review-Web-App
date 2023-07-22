const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');


app.use("/static", express.static("public"));

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

app.get("/", (req, res) => {
    res.render("index", {
        title: "Home",
        script: "static/js/IndexRules.js",
        css1: "static/css/StylesOut.css",
        css2: "static/css/ViewEstablishmentRules.js",
        css3: "static/css/restaurantStyles.css",
        jsstry: "https://kit.fontawesome.com/78bb10c051.js",
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
        css1: "static/css/styles.css",
        css2: "static/css/restaurantStyles.css"
    })
})

app.get("/restaurant", (req, res) => {
    res.render("restaurant", {
        title: "Restaurants",
        css1: "restaurantStyles.css",
        css2: "styles.css"
    })
})

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
        css1: "static/css/editProfStyles",
        css2: "static/css/ViewEstablishmentStyles.css",
        css3: "static/css/styles.css",
        css4: "static/css/reviewStyles.css"
    })
})

app.get("/RestoView-SB", (req, res) => {
    res.render("RestoView-SB", {
        title: "Starbucks",
        script: "static/js/ViewEstablishmentRules.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css",
    })
})

app.get("/RestoView-DTH", (req, res) => {
    res.render("RestoView-DTH", {
        title: "David's Tea House",
        script: "static/js/viewProfileRules.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css"

    })
})

app.get("/RestoView-ADBB", (req, res) => {
    res.render("RestoView-ADBB", {
        title: "Angry Dobo",
        script: "static/js/viewProfileRules.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css"
    })
})

app.get("/RestoView-ADBB-out", (req, res) => {
    res.render("RestoView-ADBB-out", {
        title: "Angry Dobo",
        script: "static/css/ViewEstablishmentStyles.css",
        css1: "static/css/StylesOut.css"
    })
})

app.get("/RestoView-TNB", (req, res) => {
    res.render("RestoView-TNB", {
        title: "Tinuhog ni Benny",
        script: "static/js/ViewEstablishmentRules.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "static/css/styles.css"
    })
})

app.get("/registrationPage", (req, res) => {
    res.render("registrationPage", {
        title: "When In Taft",
        css1: "static/css/loginStyles.css"
    })
})

//TODO: get the internal script
app.get("/searchPage", (req, res) => {
    res.render("searchPage", {
        title: "Search Results",
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
        css1: "statics/css/ViewEstablishmentStyles.css",
        css2: "styles.css"
    })
})

app.get("/TNBestablishmentOwnerView", (req, res) => {
    res.render("TNBestablishmentOwnerView", {
        title: "Tinuhog ni Benny",
        css1: "ViewEstablishmentStyles.css"
    })
})

app.get("/viewprofileU1", (req, res) => {
    res.render("viewprofileU1", {
        title: "View Profile",
        script: "static/js/ViewProfileRules.js",
        css1: "static/css/ViewEstablishmentStyles.css",
        css2: "styles.css"
    })
})


// intercept all requests with the content-type, application/json
// app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));
//app.use(express.urlencoded({extended: true}));


app.listen(3000, () => console.log("Express app is now listening..."));