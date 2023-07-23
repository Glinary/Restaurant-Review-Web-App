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

let rate = 5;

$(":radio").change(function () {
  console.log("New star rating: " + this.value);
  rate = this.value;

  console.log(rate);
});

