const firstName = document.querySelector("#firstname");
const lastName = document.querySelector("#lastname");
const time = document.querySelector("#time-of-day");

const result = document.querySelector(".result");
const button = document.querySelector("#generateBtn");

button.addEventListener("click", () => {
  if (firstName.value == "" || lastName.value == "" || time.value == "")
    return "";
  result.innerHTML = ` Good ${time.value}, ${firstName.value} ${lastName.value}.`;
});
