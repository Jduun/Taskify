import React, { useState, useEffect } from 'react';
import './App.css';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const [data, setData] = useState([{}])
  /*
  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
*/
  return (
    <div className="App">
      <KanbanBoard />
      {/*(typeof data.members === "undefined") ? (
        <p>Loading...</p>
      ): (
        data.members.map((m, i) => (
          <p key={i}>{m}</p>
        ))
      )*/}
    </div>
  );
}

export default App;
