//menu
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

//stars
const starList = document.querySelectorAll("#star");
let arrStar = [];

console.log(starList);

for (let i = 0; i < starList.length; i++){
arrStar.push(0)
}

for (let k = 0; k < starList.length; k++){
starList[k].addEventListener("click", function(){
  if (arrStar[k] == 0){
      starList[k].innerHTML = "<i class=\"fa-solid fa-star\" style=\"color:  #dac22b;\"></i>";
      arrStar[k] = 1;
      for (let j = 0; j < k ; j++){
        starList[j].innerHTML = "<i class=\"fa-solid fa-star\" style=\"color: #dac22b;\"></i>";
        arrStar[j] = 1;
      }
  } else if (arrStar[k] == 1 && arrStar[k+1] == 0){
    starList[k].innerHTML = "<i class=\"fa-regular fa-star\"></i></div>";
    arrStar[k] = 0;
  }
    else if (arrStar[k] == 1 && arrStar[k+1] != 0)
      for (let l = k + 1; l < starList.length; l++){
        starList[l].innerHTML = "<i class=\"fa-regular fa-star\"></i></div>";
        arrStar[l] = 0;
      }
})
}