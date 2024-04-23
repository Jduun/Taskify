import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AuthPage from "./pages/AuthPage";

function App() {
  const [data, setData] = useState([{}])
  /*
  useEffect(() => {••••••••••••
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
        <AuthPage />

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
