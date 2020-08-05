import React, {useState, useEffect} from 'react';
import Mine from './components/Mine';
import './App.css';


interface Game {
  minesPlaces: Boolean[][];
  numbersPlaces: number[][];
  openedPlaces: Boolean[][];
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
    "rows": 20,
    "columns": 25,
    "mines": 100
  }
}

const App:React.FC = () => {

  const defaultDifficulty = "normal";
  
  const [difficulty, setDifficulty]   = useState(defaultDifficulty);
  const [gameConfigs, setGameConfigs] = useState<GameConfigs>(gameConfigsOptions[difficulty]);
  const [gameStatus, setGameStatus]   = useState<GameStatus>({gameOver: false, minesLeft: 0, minesOpened: 0});
  const [game, setGame]               = useState<Game>({minesPlaces:[[]], numbersPlaces:[[]], openedPlaces:[[false]]});
 
  const generateMinesPlaces = ():Boolean[][] => {
    
    const {rows, columns, mines} = gameConfigs;

    var minesPlaces: Boolean[][] = createEmptyMatrix<Boolean>(rows, columns, false);
    let minesCounter = 0;

    while(minesCounter < mines){

      for(let i = 0; i < rows; i++ ){
        for(let j = 0; j < columns; j++){
      
          if(minesCounter < mines && (Math.random() * 10) >= 9){
            let hasMine = minesPlaces[i][j];
            if(!hasMine){
              minesCounter += 1;
              minesPlaces[i][j] = true;
            }
          }
      
        }
      }

    }
        
    return minesPlaces;
  }

  const getNumbersPlaces = (minesPlaces: Boolean[][]): number[][] => {
    const {rows, columns} = gameConfigs;

    var numberAroundPlaces: number[][] = createEmptyMatrix<number>(rows, columns, 0);
    numberAroundPlaces = numberAroundPlaces.map((row, i) => row.map((mine, j) => getMinesAroundPlace(i, j, minesPlaces)))    

    return numberAroundPlaces;
  }

  const getMinesAroundPlace =  (row: number, column: number, minesPlaces: Boolean[][]):number => {
    const {rows:totalRows, columns:totalColumns} = gameConfigs;
    let count = 0;
    for(let i = row - 1 ; i <= row + 1; i++){
      
      if(i >= 0 && i < totalRows){
        for(let j = column - 1; j <= column + 1; j++){
          if(j >= 0 && j < totalColumns && (i !== row || j !== column) ){
            if(minesPlaces[i][j])
              count++;
          }
        }
      }
    }
    return count;
  }

  useEffect(startGame, []);

  function startGame(){
    updateGameConfigs();
    createGame();
    createGameStatus();
  }  

  function updateGameConfigs(){
    setGameConfigs(gameConfigsOptions[difficulty]);
  }

  function createGame(){
    const game: Game = {minesPlaces:[], numbersPlaces:[], openedPlaces:[]};
    const {rows, columns} = gameConfigs;

    game.minesPlaces    = generateMinesPlaces();
    game.numbersPlaces  = getNumbersPlaces(game.minesPlaces);
    game.openedPlaces   = createEmptyMatrix<Boolean>(rows, columns, false);
    
    setGame(game);
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
    const {minesPlaces, openedPlaces} = game;
    const hasMine     = minesPlaces[row][column];
    const isOpen      = openedPlaces[row][column];
    const updatedGame = {...game};
    
    if(isOpen)
      return false;
    
    
    if(hasMine){
      updatedGame.openedPlaces[row][column] = true;
      setGame(updatedGame);
      gameOver();
    } else {
      openThisAndPlacesAround(row, column);
    }
    
    
  }
  
  function gameOver(){
    console.log("GAME OVER")
  }

  function openThisAndPlacesAround(row: number, column: number){
    const {rows: totalRows, columns: totalColumns} = gameConfigs;
    const {numbersPlaces, openedPlaces, minesPlaces} = game;

    if(minesPlaces[row][column] || openedPlaces[row][column]){
      return false;
    }

    if(numbersPlaces[row][column] === 0){
      let newGame = {...game};
      newGame.openedPlaces[row][column] = true;
      setGame(newGame);

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
      if(row + 1 < totalRows && column + 1 < totalColumns && numbersPlaces[row+1][column+1] !== 0)
        open(row + 1, column + 1);
      
      if(row - 1 >= 0 && column + 1 < totalColumns && numbersPlaces[row-1][column+1] !== 0)
        open(row - 1, column + 1);
        
      if(row - 1 >= 0 && column - 1 >= 0 && numbersPlaces[row-1][column-1] !== 0)
        open(row - 1, column - 1);
      
      if(row + 1 < totalRows && column - 1 >= 0 && numbersPlaces[row+1][column-1] !== 0)
        open(row + 1, column - 1);

    } else {
      open(row,column);
    }
  }

  function open(row: number, column: number){
    let newGame = {...game};
    newGame.openedPlaces[row][column] = true;
    setGame(newGame);
  }
  

  useEffect(() => {
    setGameConfigs(gameConfigsOptions[difficulty]);
  }, [difficulty]);

  return (
    <table >
      <tbody>
      {game.minesPlaces.map( (row, i) =>{
        return(
          <tr key={i} >
            {row.map((hasMine, j) => {
              return <Mine key={`${i}x${j}`} row={i} column={j} hasMine={hasMine} minesAround={game.numbersPlaces[i][j]} opened={game.openedPlaces[i][j]} SweepMine={sweepMine}  />;
            })}
          </tr>)
      })}
      </tbody>
   </table>
  );
}

export default App;


function createEmptyMatrix<T>(rows: number, columns: number, defaultValue: T): T[][]{
  var matrix:T[][] = [];
  for(let i = 0; i < rows; i++){
    let row = [];
    for(let j = 0; j < columns; j++){
      row.push(defaultValue);
    }
    matrix.push(row);
  }
  return matrix;
}