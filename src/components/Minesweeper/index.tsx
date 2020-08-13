import React, {useState, useRef} from 'react';

import EndGameModal from '../EndGameModal';
import ConfigBar from '../ConfigBar';
import Board from '../Board';

import './styles.css';


interface GameConfigs {
  rows: number;
  columns: number;
  mines: number;
}

// TODO show wrong placed flags when lost
// TODO close dropdown when clicking outside it


const gameConfigsOptions:{[key:string]: GameConfigs} = {
  "easy":{
    "rows": 8,
    "columns": 10,
    "mines": 10
  },
  "normal":{
    "rows": 14,
    "columns": 18,
    "mines": 40

  },
  "hard":{
    "rows": 18,
    "columns": 25,
    "mines": 70
  }
}

const Minesweeper:React.FC = () => {

  const defaultDifficulty = "easy";  
  const gameContainerRef  = useRef<HTMLDivElement>(null); // necessary to the shaking animation
  
  const [difficulty, setDifficulty]   = useState<string>(defaultDifficulty);
  const [gameConfigs, setGameConfigs] = useState<GameConfigs>(gameConfigsOptions[difficulty]);
  const [isGameWon, setIsGameWon]     = useState<Boolean>(false);
  const [isGameOver, setIsGameOver]   = useState<Boolean>(false);

  // values for the ConfigBar
  const [time, setTime] = useState<number>(0);
  const [flagsLeft, setFlagsLeft] = useState<number>(gameConfigs.mines);
  
  const [showGameOverModal, setShowGameOverModal] = useState<Boolean>(false);

  const gameOver = () => {
    setIsGameOver(true);
    setShowGameOverModal(true);
  }

  const gameWon = () => {
    const currentTime = time;
    setTime(currentTime);
    updateRecord(currentTime);
    setIsGameWon(true);
    setShowGameOverModal(true);
  }

  const restartGame = () => {
    setShowGameOverModal(false);
    setIsGameOver(false);
    setIsGameWon(false);
  };
  
  const changeGameDifficulty = (newDifficulty: string) => {
    let newGameConfigs = gameConfigsOptions[newDifficulty];
    setGameConfigs(newGameConfigs);
    setDifficulty(newDifficulty);
    restartGame();
  }

  function getRecord(): number {
    const record = window.localStorage.getItem("record");
    return record ? parseInt(record) : 0; 
  }

  function updateRecord(seconds: number) {
    const record = window.localStorage.getItem("record");
    if(!record || record === "0" || seconds < parseInt(record))
      window.localStorage.setItem("record", seconds.toString());
  }

  return (
    <div  className="gameContainer" 
    style={{width:gameConfigs.columns*40}}
    ref={gameContainerRef}
    >

    <EndGameModal isOpen={showGameOverModal}
                  isGameOver={isGameOver}
                  restartGame={restartGame}
                  time={time}
                  recordTime={getRecord()}
                  />

    <ConfigBar  flagsLeft={flagsLeft}
                mines={gameConfigs.mines}
                gameFinished={isGameOver || isGameWon} 
                
                difficulty={difficulty}
                difficulties={Object.keys(gameConfigsOptions)}
                changeGameDifficulty={changeGameDifficulty}
                
                time={time}
                setTime={setTime}
                />

    <Board  updateFlagsLeft={(flagsLeft) => setFlagsLeft(flagsLeft)}
            gameConfigs={gameConfigs}
            gameOver={gameOver}
            isGameOver={isGameOver}
            gameWon={gameWon}
            isGameWon={isGameWon}

            shakeGame={() => {if(gameContainerRef.current) shakeDiv(gameContainerRef.current)}}
            />

   </div>
  );
}

export default Minesweeper;

// Utils
function shakeDiv(div: HTMLDivElement){
  div.classList.add("shake");
  setTimeout(() => div.classList.remove("shake"), 1000, div);
}

