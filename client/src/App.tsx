import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="App">
      {!started ? (
        <LandingPage onStart={() => setStarted(true)} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;