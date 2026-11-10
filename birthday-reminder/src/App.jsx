import { useState } from "react";
import "./App.css";
import sara from "./assets/sara.png";
const initialPeople = [
  {
    id: 1,
    name: "Bertie Yates",
    age: 29,
    image:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&",
  },
  {
    id: 2,
    name: "Hester Hogan",
    age: 32,
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&",
  },
  {
    id: 3,
    name: "Larry Little",
    age: 36,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "Sean Walsh",
    age: 34,
    image:
      "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    name: "Lola Gardner",
    age: 29,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww",
  },
];

function App() {
  const [people, setPeole] = useState(initialPeople);
  function handleClear() {
    setPeole([]);
  }
  return (
    <div>
      <div className="container">
        <h2>{people.length} Birthdays Today</h2>
        {people.map((person) => (
          <div className="profiles" key={person.id}>
            <img src={person.image} alt={person.name} />
            <div className="info">
              <h3>{person.name}</h3>
              <p className="age">{person.age} yeras</p>
            </div>
          </div>
        ))}
        <button onClick={handleClear}>Clear All</button>
      </div>
    </div>
  );
}

export default App;
