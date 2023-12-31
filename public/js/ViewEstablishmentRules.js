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

const replyCont = document.querySelectorAll(".reply");
const replyContList = Array.from(replyCont);

const divSec = document.querySelector(".dividerSec");

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

/* -----------------------  END OF VARIABLES  --------------------------- */

checkTextTrunc();
checkReviewsCount();
replyCountCheck();

// menu bar Mobile View hovering
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

// Review User Reviews Empty Conditions
function replyCountCheck() {
  for (let i = 0; i < replyCont.length; i++) {
    console.dir(replyCont);
    repliesRepCont = replyContList[i].children[1];
    userRevText = repliesRepCont.previousElementSibling;
    rChildChild = repliesRepCont.children.length;
    if (rChildChild == 0) {
      repliesRepCont.style.display = "none";
      userRevText.style.display = "none";
    }
  }
}

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
      if (optionPath.length == 1) {
        replyButton = optionPath[0];
      } else if (optionPath.length == 3) {
        replyButton = optionPath[0];
        editButton = optionPath[1];
        deleteButton = optionPath[2];
      }

      replyButton.addEventListener("click", function () {
        console.log("Reply clicked!");

        cellParent = cell.parentElement;
        replyBox = cellParent.nextElementSibling;
        replyBox.style.display = "block";
      });

      if (optionPath.length == 3) {
        editButton.addEventListener("click", function () {
          console.log("Reply clicked!");

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
          console.log("Parent: ");
          console.dir(cellParent);
          replyBox = cellParent.nextElementSibling;
          console.log("Reply Box: ");
          console.dir(replyBox);
          repliesBox = replyBox.nextElementSibling;
          console.log("User Comments: ");
          console.dir(repliesBox);

          path = replyBox.childNodes[1].lastChild[3].value;

          // Get the reviewDesc value from the hidden input field
          const reviewID = path;
          console.log("Review ID to be deleted:", reviewID);

          // Make the AJAX request to delete the review
          fetch("/deleteReview", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reviewID }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              console.log("Review successfully deleted");

              cellParent.remove();
              repliesBox.remove();
              replyBox.remove();
              checkReviewsCount();
            })
            .catch((error) => {
              console.error("Error deleting review:", error);
              // Handle any errors that occur during the deletion process
            });
        });
      }
    }
  })
);

function reviewObjHelper(index) {
  reviewObject = reviewList[index].reviewObj;
  return reviewObject;
}

function checkReviewsCount() {
  if (divSec.children[0].children.length == 1) {
    divSec.innerHTML += '<h1 id="empty-alert">No Reviews Yet</h1>';
  }
}

// Function that adds "Edited" indicator when a user make changes to review
function ReviewEditConfirmedIndicator(reviewLeft) {
  reviewLeft.innerHTML += `<span id="editedIndc">Edited</span>`;
}

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

if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
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

    // Add highlight-outline class to the edited review element
    editedReviewElement.classList.add("highlight-outline");

    // Remove the highlight-outline class after a few seconds
    setTimeout(function () {
      editedReviewElement.classList.remove("highlight-outline");
    }, 2000); // 2 seconds (2000 milliseconds)
  }
}

function hideForm(event) {
  console.log(event.target);
  event.target.parentElement.remove();
  location.reload();
}

function replyIcon(event) {
  console.log("Reply clicked!");
  cell = event.target;

  cellParent = cell.parentElement.parentElement;
  trueCellP = cellParent.parentElement.parentElement;
  replyBox = trueCellP.nextElementSibling;
  replyBox.style.display = "block";
}

function deleteIcon(event) {
  console.log("Delete clicked!");

  cellPath = event.target.getAttribute("data-id");
  cell = event.target;
  cellRem = cell.parentElement.parentElement;

  // Get the reviewDesc value from the hidden input field
  const reviewID = cellPath;
  console.log("Review ID to be deleted:", reviewID);

  // Make the AJAX request to delete the review
  fetch("/deleteReply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviewID }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Review successfully deleted");

      cellRem.remove();
      replyCountCheck();
    })
    .catch((error) => {
      console.error("Error deleting review:", error);
      // Handle any errors that occur during the deletion process
    });
}
