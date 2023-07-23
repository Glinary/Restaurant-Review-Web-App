const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".menu-bar");
const userPage = document.querySelector("#prof-page");
const userPic = document.querySelector("#prof-pic");
const searchBar = document.querySelector(".search-container");
const hidden = document.querySelector(".hidden");
const swidth = screen.width;
const copies = document.querySelectorAll(".resto-container").length;
const restoBox = document.querySelector(".restobox-cont");
const restoDesc = document.querySelectorAll("#resto-desc");
const restoLabel = document.querySelector("#resto-innerLabel");
console.log(restoBox);

console.log(swidth);
console.log(copies);

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

if (swidth > 960 && copies % 3 == 2) {
    console.log("copies modulo:", copies % 3);

    document.querySelector(".restobox-cont").innerHTML +=
    '<div class="hidden"></div>';
}