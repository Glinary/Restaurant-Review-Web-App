// //stars
// const starList = document.querySelectorAll("#star");
// const form = document.forms[3];
// let arrStar = [];

// console.log(starList);
// console.log(form);

// for (let i = 0; i < starList.length; i++) {
//   arrStar.push(1);
//   starList[i].innerHTML =
//     '<i class="fa-solid fa-star" style="color:  #dac22b;"></i>';
// }

// for (let k = 0; k < starList.length; k++) {
//   starList[k].addEventListener("click", function () {
//     if (arrStar[k] == 0) {
//       starList[k].innerHTML =
//         '<i class="fa-solid fa-star" style="color:  #dac22b;"></i>';
//       arrStar[k] = 1;
//       console.log("heree");
//       console.log(k);
//       for (let j = 0; j < k; j++) {
//         starList[j].innerHTML =
//           '<i class="fa-solid fa-star" style="color: #dac22b;"></i>';
//         arrStar[j] = 1;
//       }
//     } else if (arrStar[k] == 1 && arrStar[k + 1] != 0)
//       for (let l = k + 1; l < starList.length; l++) {
//         starList[l].innerHTML = '<i class="fa-regular fa-star"></i></div>';
//         arrStar[l] = 0;
//         console.log("Enter2");
//         console.log(k);
//       }
//   });
// }

// const urlParams = new URLSearchParams(window.location.search);
// const restaurantName = urlParams.get("restaurantName");
// const restaurantNameInput = document.getElementById("restaurantNameInput");
// // Set the value of the hidden input field to the retrieved restaurant name
// if (restaurantNameInput) {
//   restaurantNameInput.value = restaurantName;
// }

// const urlPath = location.href.split("/").slice(-1);
// // console.log(urlPath);

// var starR = 5;

// $(":radio").change(function () {
//   console.log("New star rating: " + this.value);
//   starR = this.value;

//   // console.log(starR);
// });

// const submitForm = document.querySelector("#submitForm");
// const formElement = document.forms[1];

// submitForm.addEventListener("click", (e) => {
//   e.preventDefault();

//   const formData = new FormData(formElement);
//   const title = formData.get("title");
//   const reviewMes = formData.get("review");
//   const rate = starR;

//   const jstring = JSON.stringify({
//     reviewMes,
//     rate,
//     restaurantName,
//   });
//   console.log(jstring);

//   fetch("/reviewPagePost", {
//     method: "POST",
//     body: jstring,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     console.log(response);
//   });
// });


//ensure at least one star is selected by the user at page load
document.addEventListener("DOMContentLoaded", function () {
    // This event listener is triggered when the page finishes loading

    // Get all the radio buttons for star rating
    const starRatingRadios = document.querySelectorAll('input[name="starRating"]');

    // Set the default value to 1 star (the first radio button)
    starRatingRadios[0].checked = true;
});
