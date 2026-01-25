
const button = document.querySelector('.button');
const result = document.querySelector('.result');
const categorie = document.querySelector('.categories');
const error = document.querySelector('.error');





button.addEventListener("click", () =>{
  let height = Number(document.querySelector('#height').value);
let weight = Number(document.querySelector('#weight').value);
if (height === 0 || weight === 0) {
  error.innerText = "Please enter valid values";
  return;
}
let res = ((weight * 10000 ) / (height * height));

result.innerText = res.toFixed(2);
if(res < 18.5){
  categorie.innerText = "Underweight";
}else if(res > 18.5 && res < 24.9){
    categorie.innerText = "Normal";
}else if(res > 25 && res < 29.9){
    categorie.innerText = "Overweight";
}else if(res >= 30){
    categorie.innerText = "Obese";
}
})