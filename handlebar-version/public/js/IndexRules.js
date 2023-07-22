// Mobile View Variables
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".menu-bar");
const userPage = document.querySelector("#prof-page");
const userPic = document.querySelector("#prof-pic");
const searchBar = document.querySelector(".search-container");

// Resturant Grid View Variables
const hidden = document.querySelector(".hidden");
const swidth = screen.width;
const copies = document.querySelectorAll(".slide").length;
const restoBox = document.querySelector(".slides");
const restoDesc = document.querySelectorAll("#resto-desc");
const restoLabel = document.querySelector("#resto-innerLabel");

// Search Action Variables
const searchForm = document.querySelector("#searchform");
const searchSubmit = document.querySelector('input[type="submit"]');

// TESTER: Delete later
console.log(restoBox);
console.log(swidth);
console.log(copies);

// Rules for Menu Bar in Mobile View
menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
  searchBar.classList.toggle("active");
});

// Rules for Hovering both the "View Profile" and Avatar
userPage.addEventListener("mouseover", function () {
  userPic.classList.toggle("hovered");
});
userPage.addEventListener("mouseout", function () {
  userPic.classList.toggle("hovered");
});

// Rules for flushing all establishment cards to the left in Restaurant Grid View
if (swidth > 960 && copies % 3 == 2) {
  console.log("copies modulo:", copies % 3);
  document.querySelector(".restobox-cont").innerHTML +=
    '<div class="hidden"></div>';
}

// Rules for submitting upon hitting Enter key. 
searchForm.addEventListener("keydown", function (e) {
  if (e.keyCode == 13) {
    submitForm();
  }
});

function submitForm() {
  searchForm.submit();
}
