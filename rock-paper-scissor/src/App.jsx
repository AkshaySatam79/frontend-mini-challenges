import { Stone, Scissors, Scroll } from "lucide-react";
import "./App.css";
import { useState } from "react";

function App() {
  const [isChoice, setIsChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");

  const [yourScore, setYourScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  function handleChoice(choice) {
    setIsChoice(choice);

    const choices = ["Rock", "Paper", "Scissor"];
    const computer = choices[Math.floor(Math.random() * 3)];

    setComputerChoice(computer);

    if (computer === choice) {
      // Draw
      return alert("DRAW! 🤝");
    }

    if (
      (computer === "Rock" && choice === "Scissor") ||
      (computer === "Scissor" && choice === "Paper") ||
      (computer === "Paper" && choice === "Rock")
    ) {
      setComputerScore((score) => score + 1);
    } else {
      setYourScore((score) => score + 1);
    }
  }
  return (
    <>
      <Game
        choice={isChoice}
        handleChoice={handleChoice}
        computerChoice={computerChoice}
        yourScore={yourScore}
        computerScore={computerScore}
      />
    </>
  );
}

function Game({
  choice,
  handleChoice,
  computerChoice,
  yourScore,
  computerScore,
}) {
  return (
    <div className="container">
      <h1 className="head">Welcome To Rock Paper Scissor Game</h1>
      <div className="options">
        <Rock handleChoice={handleChoice} />
        <Paper handleChoice={handleChoice} />
        <Scissor handleChoice={handleChoice} />
      </div>
      <div className="show-results">
        {/* <h2 className="draw">{computerChoice === choice ? "Draw 🤝" : ""}</h2> */}
        <h2>
          Your Choice: <span className="user-choice">{choice}</span>
        </h2>
        <h2>
          Computer Choice: <span className="com-choice">{computerChoice}</span>
        </h2>
        <h2>Your Score: {yourScore}</h2>
        <h2>Computer Score: {computerScore}</h2>
      </div>
    </div>
  );
}

function Rock({ handleChoice }) {
  return (
    <div className="rock" onClick={() => handleChoice("Rock")}>
      <Stone />
      <p>Rock</p>
    </div>
  );
}

function Paper({ handleChoice }) {
  return (
    <div className="paper" onClick={() => handleChoice("Paper")}>
      <Scroll />
      <p>Paper</p>
    </div>
  );
}

function Scissor({ handleChoice }) {
  return (
    <div className="scissor" onClick={() => handleChoice("Scissor")}>
      <Scissors />
      <p>Scissor</p>
    </div>
  );
}
export default App;
