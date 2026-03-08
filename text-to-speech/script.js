const button = document.querySelector(".btn");
button.addEventListener('click',()=>{
  speack()
})
let speack = () => {
  let text = document.querySelector(".text").value;
  let speech = new SpeechSynthesisUtterance(text);
  speech.lang ='en-US'
  speech.pitch = 1;
  window.speechSynthesis.speak(speech)
};
