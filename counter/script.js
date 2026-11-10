let count = 0;
let container = document.querySelector(".container");
let decrement = document.querySelector(".decrement");
let increment = document.querySelector(".increment");
let reset = document.querySelector(".reset");
let input = document.querySelector(".input");

increment.addEventListener("click", () => {
  count += Number(input.value);
  container.textContent = count;
});

decrement.addEventListener("click", () => {
  count -= Number(input.value);
  container.textContent = count;
});

reset.addEventListener("click", () => {
  count = 0;
  container.textContent = count;
});
