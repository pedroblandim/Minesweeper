import React, {useState, useEffect, useRef} from 'react';
import Square from '../Square';
import ConfigBar from '../ConfigBar';
import gameOverModal from '../EndGameModal';

import './styles.css';
import EndGameModal from '../EndGameModal';


interface ISquare {
  minesAround: number;
  position: Position;
  hasMine: Boolean;
  isOpen: Boolean;
}

interface Position {
  row: number;
  column: number;
}

interface GameStatus {
  minesOpened: number;
  squaresClosed: number;
  gameOver: Boolean;
}

interface GameConfigs {
  rows: number;
  columns: number;
  mines: number;
}

// TODO implement gameOverModal
// TODO show wrong placed flags when lost
// TODO win animation
// TODO save time when the user win (use local storage)
// TODO refact dropdown (apply styles)
// TODO flags counter
// TODO win function


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
  const defaultSquare     = {hasMine:false, isOpen: false, hasFlag: false, minesAround: 0, position:{row: 0, column: 0}};
  
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const [gameConfigs, setGameConfigs] = useState<GameConfigs>(gameConfigsOptions[defaultDifficulty]);
  const [gameStatus, setGameStatus]   = useState<GameStatus>({gameOver: false, squaresClosed: 0, minesOpened: 0});

  const [squares, setSquares]         = useState<ISquare[][]>([[defaultSquare]]);
  
  const [areMinesSet, setAreMinesSet] = useState<Boolean>(false);
  const [showGameOverModal, setShowGameOverModal] = useState<Boolean>(false);


  const [time, setTime] = useState<number>(0);
  const [flagsLeft, setFlagsLeft] = useState<number>(gameConfigs.mines);

  useEffect(startGame, []);
  useEffect(startGame, [gameConfigs]);

  function startGame(){ // also restarts 
    createGameStatus();
    setShowGameOverModal(false);

    createSquares();
    setAreMinesSet(false); // the mines are only set at the first click
  }  

  function createSquares(){
    const {rows, columns} = gameConfigs;

    const squares = createEmptyMatrix<ISquare>(rows, columns, defaultSquare);
    setPositions(squares);
    setSquares(squares);
  }

  const setPositions = (squares: ISquare[][]) => {
    squares.forEach((row, i) => row.forEach((square, j) => square.position = {row:i, column: j}));
  }
  
  const createGameStatus = () => {
    const gameStatus: GameStatus ={
      gameOver: false,
      squaresClosed: gameConfigs.mines,
      minesOpened: 0
    }
    setGameStatus(gameStatus);
  }
   

  const handleOpening = (position: Position) => {
    const {row, column} = position;
    const {hasMine, isOpen, minesAround} = squares[row][column];
    
    if(isOpen || gameStatus.gameOver) return false;
    
    if(!areMinesSet){
      setMinesAround({row, column});
      setNumbers(squares);
      setAreMinesSet(true);
    }

    if(gameContainerRef.current && (hasMine || !minesAround)) shakeDiv(gameContainerRef.current);

    if(hasMine){
      open(row, column);
      gameOver({row, column});  
    } else {
      openThisAndPlacesAround(row, column);
    }
  }

  const setMinesAround = (position: Position) => {
    const {mines} = gameConfigs;
    
    let minesToPlace = mines;
    while(minesToPlace > 0){
      minesToPlace = fillWithMinesRandomlyAround(position, minesToPlace);
    }
  }

  const fillWithMinesRandomlyAround = (position: Position, minesToPlace: number):  number => {
    const {rows, columns} = gameConfigs;
    let minesPlaced     = 0;

    for(let i = 0; i < rows; i++ ){
      for(let j = 0; j < columns; j++){
        if(minesPlaced < minesToPlace 
            && !squares[i][j].hasMine 
            && (Math.random() * 10) > 9
            && getDistanceBetweenTwoPositions(position, {row:i, column:j}) > 2) // this condition prevents losing on the first click
        {
          squares[i][j].hasMine = true;
          minesPlaced++;
        }
      }
    }
    return minesToPlace - minesPlaced;
  }

  const setNumbers = (squares: ISquare[][]) => {
    squares.forEach(row => row.forEach(square => square.minesAround = getMinesAroundPlace(square.position, squares)));
  }

  const getMinesAroundPlace =  (position: Position, squares: ISquare[][]):number => {
    const {rows:totalRows, columns:totalColumns} = gameConfigs;
    const {row, column} = position;

    let count = 0;
    for(let i = row - 1 ; i <= row + 1; i++){
      
      if(i >= 0 && i < totalRows){
        for(let j = column - 1; j <= column + 1; j++){
          if(j >= 0 && j < totalColumns && (i !== row || j !== column) ){
            if(squares[i][j].hasMine)
              count++;
          }
        }
      }
    }
    return count;
  }

  const openThisAndPlacesAround = (row: number, column: number) => {
    const {rows: totalRows, columns: totalColumns} = gameConfigs;
    const {hasMine, isOpen, minesAround} = squares[row][column];

    if(hasMine || isOpen){
      return false;
    }

    open(row, column);

    if(minesAround === 0){

      // call this function to the places on the left, right, top and bottom
      if(row + 1 < totalRows)
        openThisAndPlacesAround(row + 1, column);

      if(row - 1 >= 0)
        openThisAndPlacesAround(row - 1, column);

      if(column + 1 < totalColumns)
        openThisAndPlacesAround(row, column + 1);

      if(column - 1 >= 0)
        openThisAndPlacesAround(row, column - 1);
      
      // open the places on the corners
      if(row + 1 < totalRows && column + 1 < totalColumns && squares[row+1][column+1].minesAround !== 0)
        open(row + 1, column + 1);
      
      if(row - 1 >= 0 && column + 1 < totalColumns && squares[row-1][column+1].minesAround !== 0)
        open(row - 1, column + 1);
        
      if(row - 1 >= 0 && column - 1 >= 0 && squares[row-1][column-1].minesAround !== 0)
        open(row - 1, column - 1);
      
      if(row + 1 < totalRows && column - 1 >= 0 && squares[row+1][column-1].minesAround !== 0)
        open(row + 1, column - 1);

    }
  }


  function open(row: number, column: number){
    let updatedSquares = [...squares];
    updatedSquares[row][column].isOpen = true;
    setSquares(updatedSquares);
  }

  function openPosition(position: Position){
    const {row, column} = position;
    let updatedSquares = [...squares];
    updatedSquares[row][column].isOpen = true;
    setSquares(updatedSquares);
  }
  

  const gameOver = (position: Position) => {
    const {row, column} = position;
    const openedMine = squares[row][column];

    let updatedGameStatus = {...gameStatus};
    updatedGameStatus.gameOver = true;
    setGameStatus(updatedGameStatus);

    openAllMinesAround(openedMine.position);
    setAreMinesSet(false);
  }

  const openAllMinesAround = (position: Position) => {
    const allMines = getAllMines();

    // opening the mines in this order is what makes them open in a circular pattern
    sortByDistanceFrom(position, allMines); 

    setTimeout(() => setClickListener(), 100);
    openMinesWithDelay(allMines);
  }

  const getAllMines = (): ISquare[] => {
    const allMines:ISquare[] = [];
    const {rows, columns} = gameConfigs;

    for(let i = 0; i < rows; i++){
      for(let j = 0; j < columns; j++){
        if(squares[i][j].hasMine)
          allMines.push(squares[i][j]);
      }
    }

    return allMines;
  }

  const sortByDistanceFrom = (centralPosition: Position, arrayToSort: ISquare[]): ISquare[] => {
    return arrayToSort.sort((a, b) => {
      const distanceA = getDistanceBetweenTwoPositions(centralPosition, a.position);
      const distanceB = getDistanceBetweenTwoPositions(centralPosition, b.position);
      return distanceB - distanceA;
    });
  }

  function listener() {
    setShowGameOverModal(true);
    removeClickListener();
  }

  const setClickListener = () => {
    const gameContainer = document.getElementsByClassName("gameContainer")[0];
    gameContainer.addEventListener("click", listener);
  };

  const removeClickListener = () => {
    const gameContainer = document.getElementsByClassName("gameContainer")[0];
    gameContainer.removeEventListener("click", listener);
  }

  const openMinesWithDelay = (squaresArray: ISquare[]) => {
    setTimeout(() =>{
      if(squaresArray.length === 0){
        setShowGameOverModal(true);
        return false;
      }


      openPosition(squaresArray[squaresArray.length - 1].position);
      squaresArray.pop();
      openMinesWithDelay(squaresArray);
    }, 150 + 50 * (squaresArray.length % 2), squaresArray);
  }

  
  const changeGameDifficulty = (newDifficulty: string) => {
    let newGameConfigs = gameConfigsOptions[newDifficulty];
    setGameConfigs(newGameConfigs);
  }

  const updateNumberOfFlags = (flagsAdded: number) => {
    setFlagsLeft(flagsLeft - flagsAdded)
  }

  return (
    <div  className="gameContainer" 
    style={{width:gameConfigs.columns*40}}
    ref={gameContainerRef}
    >
    {/* {showGameOverModal ? <GameOverModal /> : ""} */}
    <EndGameModal isOpen={showGameOverModal}
                  isGameOver={gameStatus.gameOver}
                    restartGame={startGame}
                    time={time}
                    score={0}
                    />

    <ConfigBar  flagsLeft={flagsLeft}
                mines={gameConfigs.mines}
                gameOver={gameStatus.gameOver} 
                
                difficulties={Object.keys(gameConfigsOptions)}
                changeGameDifficulty={changeGameDifficulty}
                
                time={time}
                setTime={setTime}
                />
    <table>
      <tbody>
      {squares.map( (row, i) =>{
        return(
          <tr key={i} >
            {row.map((square, j) => {
              const {hasMine, minesAround, isOpen, position} = square;
              return <Square  key         = {`${i}x${j}`} 
                            position    = {position}
                            isOpen      = {isOpen} 
                            hasMine     = {hasMine} 
                            minesAround = {minesAround} 
                            
                            handleOpening   = {handleOpening}
                            updateNumberOfFlags = {updateNumberOfFlags}
                            />;
            })}
          </tr>)
      })}

      </tbody>
   </table>
   </div>
  );
}

export default Minesweeper;


function createEmptyMatrix<T>(rows: number, columns: number, defaultValue: T): T[][]{
  var matrix:T[][] = [];
  for(let i = 0; i < rows; i++){
    let row = [];
    for(let j = 0; j < columns; j++){
      row.push({...defaultValue});
    }
    matrix.push(row);
  }
  return matrix;
}

function getDistanceBetweenTwoPositions(a: Position, b: Position){
  return Math.sqrt((a.row - b.row)**2 + (a.column - b.column)**2);
}

function shakeDiv(div: HTMLDivElement){
  div.classList.add("shake");
  setTimeout(() => div.classList.remove("shake"), 1000, div);
}

