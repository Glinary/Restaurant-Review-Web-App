const reviews = document.querySelectorAll(".review"); // List of all review text containers
const times = document.querySelectorAll(".review").length; // Total number of review text containers
const editBar = document.querySelectorAll("#EditMenu");
const reactionH = document.querySelectorAll("#helpful");
const reactionU = document.querySelectorAll("#unhelpful");
const reaction = document.querySelectorAll("#reaction");
const body = document.getElementsByTagName("BODY")[0];
let arrH = [];
let arrU = [];
let currLike = [];
let currDLike = [];
let truncate = [];
let truncated = [];
let flag = [];
let toggle = [];
let flag2 = true;

const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".menu-bar");
const userPage = document.querySelector("#prof-page");
const userPic = document.querySelector("#prof-pic");
const searchBar = document.querySelector(".search-container");

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

for (let a = 0; a < reviews.length; a++) {
  flag.push(false);
  flag.push(false);
  toggle.push(false);
  toggle.push(false);
}
// more/less event listener
for (let i = 0; i < times; i = i + 1) {
  revs = reviews[i];

  org = revs.innerText.length;
  console.log("org before: ", org);
  orig = JSON.parse(JSON.stringify(org));

  // assign value of text shown here (change 80)
  revs.innerText = truncateText(revs, 80, i);
  console.log("org after: ", orig);

  if (org > 80) {
    console.log("LENGTH: ", org);
    revs.innerHTML += '<span id="more">&nbsp;See More</span>';
  }
}

// https://stackoverflow.com/a/63162630
function truncateText(selector, maxLength, i) {
  var element = selector;
  truncated[i] = element.innerText;
  truncate[i] = truncated[i];

  if (truncated[i].length > maxLength) {
    truncated[i] = truncated[i].substr(0, maxLength) + "...";

    flag[i] = true;
    console.log("trucated: ", truncated[i]);
    console.log(element, "Successfully Truncated");
  }
  return truncated[i];
}

for (let a = 0; a < reviews.length; a++) {
  truncate.push("");
  truncated.push("");
}
//https://stackoverflow.com/a/62555388
for (let b = 0; b < times; b++) {
  reviews[b].addEventListener("click", function () {
    if (toggle[b] == false && flag[b] == true) {
      reviews[b].innerHTML = truncate[b];
      reviews[b].innerHTML += '<span id="more">&nbsp;See Less</span>';
      toggle[b] = true;
    } else if (toggle[b] == true && flag[b] == true) {
      reviews[b].innerHTML = truncated[b];
      reviews[b].innerHTML += '<span id="more">&nbsp;See More</span>';
      toggle[b] = false;
    }
  });
}
// more/less event listener end...

// editBar div event listener (when clicked delete/edit shows)
editBar.forEach((cell) =>
  cell.addEventListener("click", function () {
    if (flag2 == true) {
      console.log(cell);
      cld = cell.lastElementChild;
      console.log(cld);
      cld.style.display = "block";
      flag2 = false;
    } else if (flag2 == false) {
      console.log(cell);
      cld = cell.lastElementChild;
      console.log(cld);
      cld.style.display = "none";
      flag2 = true;
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

// console.log(reaction[1]);

/*Initialize Reaction Button Data*/
for (let i = 0; i < reactionH.length; i++) {
  arrH.push(0);
  arrU.push(0);
  currLike.push(parseInt(reactionH[i].nextSibling.attributes[1].value));
  currDLike.push(parseInt(reactionU[i].nextSibling.attributes[1].value));
}
/* CHECKER
    console.log(arrH);
    console.log(arrU);
    console.log(currLike);
    console.log(currDLike);
*/

for (let j = 0; j < reactionH.length; j++) {
  reactionH[j].addEventListener("click", function () {
    if (arrU[j] == 0 && arrH[j] == 0) {
      reactionH[j].innerHTML =
        '<i class="fa-solid fa-thumbs-up" style="color: #087d6f;"></i>';
      currLike[j] += 1;
      reactionH[j].nextSibling.innerText = currLike[j];
      arrH[j] = 1;
      console.log(arrH);
    } else if (arrU[j] == 0 && arrH[j] == 1) {
      reactionH[j].innerHTML =
        '<i class="fa-solid fa-thumbs-up" style="color: #000000"></i>';
      currLike[j] -= 1;
      reactionH[j].nextSibling.innerText = currLike[j];
      arrH[j] = 0;
      console.log(arrH);
    }
  });
}

for (let k = 0; k < reactionU.length; k++) {
  reactionU[k].addEventListener("click", function () {
    if (arrH[k] == 0 && arrU[k] == 0) {
      reactionU[k].innerHTML =
        '<i class="fa-solid fa-thumbs-down" style="color: #087d6f;"></i>';
      currDLike[k] += 1;
      reactionU[k].nextSibling.innerText = currDLike[k];
      arrU[k] = 1;
      console.log(arrH);
    } else if (arrH[k] == 0 && arrU[k] == 1) {
      reactionU[k].innerHTML =
        '<i class="fa-solid fa-thumbs-down" style="color: #000000"></i>';
      currDLike[k] -= 1;
      reactionU[k].nextSibling.innerText = currDLike[k];
      arrU[k] = 0;
      console.log(arrU);
    }
  });
}
