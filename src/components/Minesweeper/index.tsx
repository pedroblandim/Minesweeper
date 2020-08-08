import React, {useState, useEffect} from 'react';
import Square from '../Square';
import ConfigBar from '../ConfigBar';
import './styles.css';


interface ISquare {
  hasMine: Boolean;
  isOpen: Boolean;
  minesAround: number;
}


interface GameStatus {
  minesOpened: number;
  minesLeft: number;
  gameOver: Boolean;
}

interface GameConfigs {
  rows: number;
  columns: number;
  mines: number;
}

// TODO restart time when the game restarts
// TODO do GameOver functions
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
  
  const [gameConfigs, setGameConfigs] = useState<GameConfigs>(gameConfigsOptions[defaultDifficulty]);
  const [gameStatus, setGameStatus]   = useState<GameStatus>({gameOver: false, minesLeft: 0, minesOpened: 0});

  const [squares, setSquares]         = useState<ISquare[][]>([[{hasMine:false, isOpen: false, minesAround: 0}]]);
  
  const setMines = (squares: ISquare[][]) => {
    const {mines} = gameConfigs;
    
    let minesToPlace = mines;
    while(minesToPlace > 0){
      minesToPlace = fillWithMinesRandomly(squares, minesToPlace);
    }
  }

  const fillWithMinesRandomly = (squares: ISquare[][], minesToPlace: number):  number => {
    const columns = squares[0].length;
    const rows    = squares.length;
    let minesPlaced     = 0;

    for(let i = 0; i < rows; i++ ){
      for(let j = 0; j < columns; j++){
        if(minesPlaced < minesToPlace && !squares[i][j].hasMine && (Math.random() * 10) > 9){
          squares[i][j].hasMine = true;
          minesPlaced++;
        }
      }
    }
    return minesToPlace - minesPlaced;
  }

  const setNumbers = (squares: ISquare[][]) => {
    const rows    = squares.length;
    const columns = squares[0].length;

    for(let i = 0; i < rows; i++){
      for(let j = 0; j < columns; j++){
        squares[i][j].minesAround = getMinesAroundPlace(i, j, squares);
      }
    }
   
    
  }

  const getMinesAroundPlace =  (row: number, column: number, squares: ISquare[][]):number => {
    const {rows:totalRows, columns:totalColumns} = gameConfigs;
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

  useEffect(startGame, []);
  useEffect(startGame, [gameConfigs]);

  function startGame(){ // also restarts 
    createGame();
    createGameStatus();
  }  


  function createGame(){
    const {rows, columns} = gameConfigs;

    const squares = createEmptyMatrix<ISquare>(rows, columns, {hasMine: false, isOpen: false, minesAround: 0});
    setMines(squares);
    setNumbers(squares);
    setSquares(squares);

  }

  function createGameStatus(){
    const gameStatus: GameStatus ={
      gameOver: false,
      minesLeft: gameConfigs.mines,
      minesOpened: 0
    }
    setGameStatus(gameStatus);
  }

  
  const sweepMine = (row: number, column: number) => {
    const {hasMine, isOpen} = squares[row][column];
    
    if(isOpen)
      return false;

    if(hasMine){
      open(row, column);
      gameOver();  
    } else {
      openThisAndPlacesAround(row, column);
    }
  }
  
  const changeGameDifficulty = (newDifficulty: string) => {
    let newGameConfigs = gameConfigsOptions[newDifficulty];
    setGameConfigs(newGameConfigs);
  }

  function gameOver(){
    let updatedGameStatus = {...gameStatus};
    updatedGameStatus.gameOver = true;
    setGameStatus(updatedGameStatus);
    console.log("perdeu");
  }

  function openThisAndPlacesAround(row: number, column: number){
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
  


  return (
    <div  className="gameContainer" 
          style={{width:gameConfigs.columns*40}}>

    <ConfigBar  flagsLeft={40} 
                gameOver={gameStatus.gameOver} 
                mines={gameConfigs.mines}
                changeGameDifficulty={changeGameDifficulty}
                difficulties={Object.keys(gameConfigsOptions)}
                />
    
    <table >
      <tbody>
      {squares.map( (row, i) =>{
        return(
          <tr key={i} >
            {row.map((square, j) => {
              const {hasMine, minesAround, isOpen} = square;
              return <Square  key         = {`${i}x${j}`} 
                            row         = {i} 
                            column      = {j} 
                            opened      = {isOpen} 
                            hasMine     = {hasMine} 
                            minesAround = {minesAround} 
                            SweepMine   = {sweepMine}  
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