const reviews = document.querySelectorAll(".review"); // List of all review text containers
const times = document.querySelectorAll(".review").length; // Total number of review text containers
const editBar = document.querySelectorAll("#EditMenu");
const reactionH = document.querySelectorAll("#helpful");
const countingSpan = document.querySelectorAll(".count");
const body = document.getElementsByTagName("BODY")[0];
const edbar = document.querySelectorAll("#EditNav");

const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".menu-bar");
const userPage = document.querySelector("#prof-page");
const userPic = document.querySelector("#prof-pic");
const searchBar = document.querySelector(".search-container");

const revSec = document.querySelector(".reviews-section");

let flag2 = true;

// GIVEN: Create a User constructor
const Review = function (reviewObj) {
  this.reviewObj = reviewObj;
  this.OrigText = JSON.parse(JSON.stringify(reviewObj.innerText));
  this.currentText = null;

  this.flag = false;
  this.toggle = false;
};

let reviewList = [];

checkTextTrunc();
checkReviewsCount();

menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
  searchBar.classList.toggle("active");
});
userPage.addEventListener("mouseover", function () {
  userPic.classList.toggle("hovered");
});
userPage.addEventListener("mouseout", function () {
  userPic.classList.toggle("hovered");
});

// more/less event listener
function checkTextTrunc() {
  for (let i = 0; i < times; i = i + 1) {
    revs = reviews[i];
    reviewList.push(new Review(revs));
    revObj = reviewObjHelper(i);

    // assign value of text shown here (change 80)
    revObj.innerText = truncateText(reviewList[i], 80, i, revObj);

    if (reviewList[i].OrigText.length > 80) {
      revObj.innerHTML += '<span id="more">&nbsp;See More</span>';
    }
  }
}

// Truncate excess texts
// https://stackoverflow.com/a/63162630
function truncateText(selector, maxLength, i, obj) {
  let element = selector;
  let toTruncate = element.OrigText;

  if (toTruncate.length > maxLength) {
    element.currentText = toTruncate.substr(0, maxLength) + "...";
    obj.innerText = element.currentText;

    element.flag = true;
    console.log(element, "Successfully Truncated");
  }
  return obj.innerText;
}

// toggle between see more and see less
//https://stackoverflow.com/a/62555388
for (let b = 0; b < times; b++) {
  reviews[b].addEventListener("click", function () {
    revObj = reviewObjHelper(b);
    if (reviewList[b].toggle == false && reviewList[b].flag == true) {
      revObj.innerHTML = reviewList[b].OrigText;
      revObj.innerHTML += '<span id="more">&nbsp;See Less</span>';
      reviewList[b].toggle = true;
    } else if (reviewList[b].toggle == true && reviewList[b].flag == true) {
      revObj.innerHTML = reviewList[b].currentText;
      revObj.innerHTML += '<span id="more">&nbsp;See More</span>';
      reviewList[b].toggle = false;
    }
  });
}

// more/less event listener end...
function textOrigHelper(i) {
  revs = reviews[i];
  org = revs.innerText;
  console.log("org before: ", org);
  orig = JSON.parse(JSON.stringify(org));

  return orig;
}

// editBar div event listener (when clicked delete/edit shows)
editBar.forEach((cell) =>
  cell.addEventListener("click", function () {
    console.dir(cell);
    if (flag2 == true) {
      console.log("3 Bars has been clicked...");
      cld = cell.lastElementChild;
      console.dir(cld);
      cld.style.display = "block";
      flag2 = false;
    } else if (flag2 == false) {
      console.log("3 Bars has been unclicked...");
      cld = cell.lastElementChild;
      cld.style.display = "none";
      flag2 = true;
    }

    if (flag2 == false) {
      console.log("UL now being read...");
      optionPath = cld.firstElementChild.children;
      editButton = optionPath[0];
      deleteButton = optionPath[1];

      editButton.addEventListener("click", function () {
        console.log("Edit clicked!");

        // Parent cell called
        cellParent = cell.parentElement;
        // Review left called.
        reviewLeft = cellParent.firstElementChild;
        //Review called
        reviewCont = reviewLeft.children[2];
        //Inner Text copied
        textValue = reviewCont.innerText;

        reviewListArr = Array.from(reviews);
        selectedRevIndex = reviewListArr.indexOf(reviewCont);

        // Replace Text with Edit Box
        revObj = reviewObjHelper(selectedRevIndex);
        revObj.innerHTML = "";

        revObj.nextElementSibling.style.display = "block";
        editBoxPath = revObj.nextElementSibling.children[0];
        editBoxPath[0].value = reviewList[selectedRevIndex].OrigText;

        console.dir(reviewCont);
      });

      deleteButton.addEventListener("click", function () {
        console.log("Delete clicked!");

        cellParent = cell.parentElement;
        cellGrandP = cellParent.parentElement;
        cellParent.remove();

        // if (cellGrandP.children.length == 1) {
        //   cellGrandP.innerHTML += '<p id="empty-alert">No reviews.</p>';
        // }

        checkReviewsCount();

        console.log("Review Successfully Deleted");
      });
    }
  })
);

// click everywhere event listener
//https://stackoverflow.com/a/33657471
body.addEventListener(
  "click",
  function () {
    if (flag2 == false) {
      cld.style.display = "none";
      flag2 = true;
    }
  },
  false
);
// excludes editbar
editBar.forEach(
  (cell) =>
    cell.addEventListener("click", function (ev) {
      ev.stopPropagation(); //this is important! If removed, you'll get both alerts
    }),
  false
);
// excludes reaction div
reactionH.forEach(
  (cell) =>
    cell.addEventListener("click", function (ev) {
      ev.stopPropagation(); //this is important! If removed, you'll get both alerts
    }),
  false
);

// Function that adds "Edited" indicator when a user make changes to review
async function sendFunc(event) {
  console.log(event);
  let checkbox = event.target;
  const dataId = checkbox.getAttribute("data-id");
  let image = checkbox.parentElement.querySelector(".icon img");
  const countSpan = checkbox.parentElement.querySelector(".count"); // Find the correct count span

  try {
    const response = await fetch("/loadReactionPostMin?ID=" + dataId, {
      method: "GET",
    });

    const data = await response.json();

    countValue = data.likeCount;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  let toggle = checkbox.checked;
  let toggled = 0;

  console.log("FUNCTION HERE");
  console.log("Data-id value:", dataId);
  console.log("Data toggle:", toggle);
  console.log("Data count:", countValue);

  if (toggle) {
    toggled = 1;
    console.log("box is toggled");
    image.src = "assets/tbUP1.png";
    countL = countValue + 1;
    countSpan.textContent = countL;

    // Use the fetch API to send the data to the server
    const data = { dataId, countL, toggled };
    fetch("/reactionPost", {
      method: "POST",
      body: JSON.stringify(data), // Send the data object as JSON
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
    });
  } else {
    toggled = 0;

    const data = { dataId, countValue, toggled }; // Create a new object with the necessary data

    (async () => {
      try {
        const response = await fetch("/reactionPost", {
          method: "POST",
          body: JSON.stringify(data), // Send the data object as JSON
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(response);

        const response2 = await fetch("/loadReactionPostMin?ID=" + dataId, {
          method: "GET",
        });

        const data1 = await response2.json();

        countValue = data1.likeCount;
        console.log("UNTOGGLED: ", countValue);

        image.src = "assets/tbUP0.png"; // Replace with the original image source for unchecked state
        console.log("box is not toggled");
        countSpan.textContent = countValue;
        //silentReload();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM HERE");
  // Retrieve the stored values from local storage and update the UI

  countingSpan.forEach(async (checkboxx) => {
    console.log(checkboxx);
    const dataId =
      checkboxx.parentElement.firstElementChild.getAttribute("data-id");
    const dataCount = parseInt(checkboxx.getAttribute("value"));
    const countSpan = checkboxx.parentElement.querySelector(".count");
    let image = checkboxx.parentElement.querySelector(".icon img");

    console.log("Data-id value:", dataId);
    console.log("Data count:", dataCount);

    try {
      const response = await fetch("/loadReactionPost?ID=" + dataId, {
        method: "GET",
      });

      const data = await response.json();

      if (data.liked) {
        // do something
        image.src = "assets/tbUP1.png";
        console.log("box is toggled");
        countSpan.textContent = dataCount;
        checkboxx.parentElement.firstElementChild.checked = true;
      } else if (data.liked == false) {
        image.src = "assets/tbUP0.png"; // Replace with the original image source for unchecked state
        console.log("box is not toggled");
        countSpan.textContent = dataCount;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
});

/* Helper Function Section */

// returns the review box
function reviewObjHelper(index) {
  reviewObject = reviewList[index].reviewObj;
  return reviewObject;
}

function checkReviewsCount() {
  if (revSec.children.length == 1) {
    revSec.innerHTML += '<h1 id="empty-alert">No Reviews Yet</h1>';
  }
}

// Check if the URL has the editedReview parameter
const urlParamss = new URLSearchParams(window.location.search);
const editedReviewID = urlParamss.get("editedReview");

if (editedReviewID) {
  // Use the editedReviewID to find the corresponding review element
  const editedReviewElement = document.getElementById(editedReviewID);

  if (editedReviewElement) {
    // Scroll to the edited review element
    editedReviewElement.scrollIntoView({ behavior: "smooth" });
  }
}

function hideForm(event) {
  console.log(event.target);
  event.target.parentElement.remove();
  location.reload();
}
