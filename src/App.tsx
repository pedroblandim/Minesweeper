import React from 'react';
import Minesweeper from './components/Minesweeper';
import './App.css';

const App:React.FC = () => {

  return (
    <div style={{width:"100%", position:"relative"}} >
      <Minesweeper />
    </div>
  );
}

export default App;
