import Gallery from '../schema/Gallery.js';
import Restaurant from '../schema/Restaurant.js';
import Reviews from '../schema/Reviews.js';
import Users from '../schema/Users.js';
import path from "path";
import upload from "../middleware/upload.js" //uploading js

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
const controller = {

    getIndex: async function (req, res) {
        const restaurants = await Restaurant.find().lean();
        console.log(restaurants);

        res.render("index", {
            title: "Home",
            script: "/js/IndexRules.js",
            script2: "https://kit.fontawesome.com/78bb10c051.js",
            css1: "/css/StylesOut.css",
            script3: "/css/ViewEstablishmentRules.js",
            css3: "/css/restaurantStyles.css",
            restaurants: restaurants,
        });
    },

    getIndexLog: async function(req, res) {
        const restaurants = await Restaurant.find().lean();
        console.log(restaurants);

        try {
            // Query everything that has a restaurant name of "Starbucks"
            // TODO: set query to current user object
            const user = await Users.findOne({ email: currentAccount.email }).lean();
            console.log(user);

            res.render("indexLog", {
            title: "Home",
            script: "/js/IndexRules.js",
            script2: "https://kit.fontawesome.com/78bb10c051.js",
            css1: "/css/styles.css",
            css2: "/css/restaurantStyles.css",
            user: user,
            restaurants: restaurants,
            });
        } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
        }
    },

    getLoginPage: async function(req, res) {
        res.render("loginPage", {
            title: "When In Taft",
            css1: "/css/loginStyles.css",
        });
    },

    postLoginPage: async function(req, res) {
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
    },

    getRestaurant: async function (req, res) {
        const user = await Users.findOne({ email: currentAccount.email }).lean();
        console.log(user);
        const restaurants = await Restaurant.find().lean();
        console.log(restaurants);

        res.render("restaurant", {
            title: "Restaurants",
            script1: "/js/RestaurantGridRules.js",
            script2: "https://kit.fontawesome.com/78bb10c051.js",
            css1: "/css/restaurantStyles.css",
            css2: "/css/styles.css",
            restaurants: restaurants,
            user: user,
        });
    },

    getRestaurantLogout: async function (req, res) {
        const restaurants = await Restaurant.find().lean();
        console.log(restaurants);

        res.render("restaurantLogout", {
            title: "Restaurants",
            script: "/js/RestaurantGridRules.js",
            css1: "/css/restaurantStyles.css",
            css2: "/css/StylesOut.css",
            restaurants: restaurants,
        });
    },

    getReviewPage: async function (req, res) {
        const user = await Users.findOne({ email: currentAccount.email }).lean();
        console.log(user);
        res.render("reviewPage", {
            title: "User Review Page",
            script: "/js/ViewEstablishmentRules.js",
            script2: "https://kit.fontawesome.com/78bb10c051.js",
            script3: "/js/reviewPageRules.js",
            script4: "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js",
            css1: "/css/editProfStyles.css",
            css2: "/css/ViewEstablishmentStyles.css",
            css3: "/css/styles.css",
            css4: "/css/reviewStyles.css",
            user: user,
        });
    },

    postReviewPage: async function (req, res) {
        //TODO: determine how to get back previous webpage (if galeng kay tnb, dapat tnb)
        //TODO: how to get star rating with the current GUI-like interface of the stars
        const { reviewTitle, reviewDesc, starRating, restaurantName } = req.body;
        console.log("----");
        console.log("READ MEEEEEEEEEEEEEEEEEE")
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
            res.redirect(`/restoView?restaurantName=${restaurantName}`);
            });
        } else {
            res.status(400);
            res.redirect("/reviewPage");
            console.log("readme");
        }
    },

    getRestoView: async function (req, res) {
        try {
            const { restaurantName } = req.query;
            const reviews = await Reviews.find({ restaurantName: restaurantName }).lean();
            let restaurant = await Restaurant.findOne({ name: restaurantName }).lean();
            console.log(restaurant);
        
            // Another query to get the highest-rated review for Starbucks
            const highestRated = await Reviews.findOne({ restaurantName: restaurantName })
              .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
              .limit(1) // Limit the result to one review
              .lean();
            const user = await Users.findOne({ email: currentAccount.email }).lean();
            // Gallery
            const gallery = await Gallery.find({ restaurantName: restaurantName }).lean();
        
            res.render("restoView", {
              title: restaurantName,
              script: "/js/ViewEstablishmentRules.js",
              script2: "https://kit.fontawesome.com/78bb10c051.js",
              css1: "/css/ViewEstablishmentStyles.css",
              css2: "/css/styles.css",
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
    },

    postRestoView: function (req, res) {
        const { reviewReply, reviewDesc, reviewId, restaurantName } = req.body;
        console.log("----");
        console.log(reviewReply);
        console.log(reviewDesc);
        console.log(reviewId);
        console.log(restaurantName)
        console.log("----");

        Reviews.findOneAndUpdate(
            { _id: reviewId }, // find the matching reviewDesc
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
            res.redirect(`/restoView?restaurantName=${restaurantName}`);
            })
            .catch((err) => {
            console.error("Error updating review:", err);
            res.status(500).json({ error: "Error updating review" });
            });
    },

    getRestoOut: async function (req, res) {
        try {
            const { restaurantName } = req.query;
            // Query everything that has a restaurant name of "Starbucks"
            const reviews = await Reviews.find({ restaurantName: restaurantName }).lean();
            const restaurant = await Restaurant.findOne({ name: restaurantName }).lean();
            console.log("resto-out:", restaurantName)
        
            // Another query to get the highest-rated review for Starbucks
            const highestRated = await Reviews.findOne({ restaurantName: restaurantName })
              .sort({ starRating: -1 }) // Sort by starRating in descending order (-1)
              .limit(1) // Limit the result to one review
              .lean();
            // Gallery
            const gallery = await Gallery.find({ restaurantName: restaurantName }).lean();
        
            res.render("restoOut", {
              title: restaurantName,
              script: "/js/ViewEstablishmentRules.js",
              script2: "https://kit.fontawesome.com/78bb10c051.js",
              css1: "/css/ViewEstablishmentStyles.css",
              css2: "/css/stylesOut.css",
              reviews: reviews,
              highestRated: highestRated,
              gallery: gallery,
              restaurant: restaurant,
            });
          } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
          }
    },

    postDeleteReview: async function (req, res) {
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
    },

    getRegistrationPage: function (req, res) {
        res.render("registrationPage", {
            title: "When In Taft",
            css1: "/css/loginStyles.css",
          });
    },

    postRegistrationPage: async function (req, res) {
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
    },

    getSearchPage: async function (req, res) {
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
              script3: "/js/SearchPage.js",
              css1: "/css/restaurantStyles.css",
              css2: "/css/SearchStyle.css",
              css3: "/css/styles.css",
              restaurants: restaurants,
              keyword: keyword,
            });
          } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
          }
    },

    postSearchPage: async function (req, res) {
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
    },

    postSearchPageFilter: function (req, res) {
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
    },

    postSearchPageLogoutFilter: function (req, res) {
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
    },

    getSearchPageLogout: async function (req, res) {
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
              script3: "/js/SearchPage.js",
              css1: "/css/restaurantStyles.css",
              css2: "/css/SearchStyle.css",
              css3: "/css/styles.css",
              restaurants: restaurants,
              keyword: keyword,
            });
          } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
          }
    },

    postSearchPageLogout: function (req, res) {
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
    },

    getEditProfile: async function (req, res) {
        try {
            // Query everything that has a restaurant name of "Starbucks"
            // TODO: set query to current user object
            const user = await Users.findOne({ email: currentAccount.email }).lean();
            console.log(user);
        
            res.render("editProfile", {
              title: "User Review Page",
              script1: "/js/ViewEstablishmentRules.js",
              script2: "https://kit.fontawesome.com/78bb10c051.js",
              css1: "/css/editProfStyles.css",
              css2: "/css/ViewEstablishmentStyles.css",
              css3: "/css/styles.css",
              user: user,
            });
          } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
          }
    },

    postEditProfile: upload.single("avatar"), function (req, res) {
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
                //update reviews if there is:
                const reviews = Reviews.find({ email: email }).lean();
                if (reviews) { 
                    if(req.file) {
                    Reviews.updateMany({ email: email }, 
                                        { userName: userName, avatar: img})
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
                    } else {
                    Reviews.updateMany({ email: email }, 
                        { userName: userName })
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
                }
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
    },

    getViewProfileU1: async function (req, res) {
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
            script: "/js/ViewProfileRules.js",
            script2: "https://kit.fontawesome.com/78bb10c051.js",
            css1: "/css/ViewEstablishmentStyles.css",
            css2: "/css/styles.css",
            user: user,
            reviews: reviews,
            });
        } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
        }
        //
    },

    getVisitProfile: async function (req, res) {
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
            script: "/js/ViewProfileRules.js",
            script2: "https://kit.fontawesome.com/78bb10c051.js",
            css1: "/css/ViewEstablishmentStyles.css",
            css2: "/css/styles.css",
            visit: visit,
            user: user,
            reviews: reviews,
            });
        } catch (error) {
            console.error("Error querying reviews:", error);
            res.status(500).send("Error querying reviews");
        }
        //
    },

    getLoadReactionPost: async function (req, res) {
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
    },

    getLoadReactionPostMin: async function (req, res) {
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
    },

    postReactionPost: async function (req, res) {
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
                res.redirect("RestoView-DTH");
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
    },

}

export default controller;