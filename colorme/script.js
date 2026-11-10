let cellNum = document.querySelector(".cellnum");
// let boxes = document.querySelector('.boxes');
// let cell = document.querySelector('.box');
let colorMe = document.querySelector(".btn");
let rowInput = document.querySelector(".row");
let columnInput = document.querySelector(".column");
let boxes = document.querySelectorAll(".boxes .box");
let box = document.querySelector(".box");

// colorMe.addEventListener("click", () => {
//   let value = Number(cellNum.value);

//   boxes.forEach((box) => (box.style.background = ""));

//   if (value >= 1 && value <= boxes.length) {
//     boxes[value - 1].style.background = "rgb(151, 95, 203)";
//   }
// });

// colorMe.addEventListener("click", () => {
//   let rowValue = Number(row.value);
//   let columnValue = Number(column.value);

//   boxes.forEach((box) => (box.style.background = ""));

//   if (rowValue == 1 && columnValue == 1) {
//     boxes[0].style.background =
//       "rgb(151, 95, 203)";
//   } else if (rowValue == 1 && columnValue == 2) {
//     boxes[1].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 1 && columnValue == 3) {
//     boxes[4].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 2 && columnValue == 1) {
//     boxes[3].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 2 && columnValue == 2) {
//     boxes[4].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 2 && columnValue == 3) {
//     boxes[5].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 3 && columnValue == 1) {
//     boxes[6].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 3 && columnValue == 2) {
//     boxes[7].style.background = "rgb(151, 95, 203)";
//   }else if (rowValue == 3 && columnValue == 3) {
//     boxes[8].style.background = "rgb(151, 95, 203)";
//   }
// });



colorMe.addEventListener("click", () => {
  const cell = Number(cellNum.value);
  const row = Number(rowInput.value);
  const col = Number(columnInput.value);

  // clear previous color
  boxes.forEach(box => box.classList.remove("highlight"));

  // ✅ Priority 1: Cell number
  if (cell >= 1 && cell <= 9) {
    boxes[cell - 1].classList.add("highlight");
    return;
  }

  // ✅ Priority 2: Row + Column
  if (row >= 1 && row <= 3 && col >= 1 && col <= 3) {
    const index = (row - 1) * 3 + (col - 1);
    boxes[index].classList.add("highlight");
    return;
  }

  alert("Enter either Cell Number (1–9) OR Row & Column (1–3)");
});

