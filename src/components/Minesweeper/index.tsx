import React, {useState, useEffect} from 'react';
import Square from '../Square';
import ConfigBar from '../ConfigBar';
import './styles.css';


interface ISquare {
  hasMine: Boolean;
  isOpen: Boolean;
  minesAround: number;
  position: Position;
}

interface Position {
  row: number;
  column: number;
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

// TODO transform Time FC in a Class Component and create start and stop function using ref
// TODO shake animation
// TODO restart time when the game restarts
// TODO create the game only at the first click, making the first opened square to be empty
// TODO do GameOver functions
// TODO make logic that passes game over animation when user clicks
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
  const defaultSquare     = {hasMine:false, isOpen: false, minesAround: 0, position:{row: 0, column: 0}};
  
  const [gameConfigs, setGameConfigs] = useState<GameConfigs>(gameConfigsOptions[defaultDifficulty]);
  const [gameStatus, setGameStatus]   = useState<GameStatus>({gameOver: false, minesLeft: 0, minesOpened: 0});

  const [squares, setSquares]         = useState<ISquare[][]>([[defaultSquare]]);
  

  useEffect(startGame, []);
  useEffect(startGame, [gameConfigs]);
  useEffect(setClickListener, [gameStatus]);

  function startGame(){ // also restarts 
    createGame();
    createGameStatus();
  }  


  function createGame(){
    const {rows, columns} = gameConfigs;

    const squares = createEmptyMatrix<ISquare>(rows, columns, defaultSquare);
    setPositions(squares);
    setMines(squares);
    setNumbers(squares);
    setSquares(squares);

  }

  const setPositions = (squares: ISquare[][]) => {
    squares.forEach((row, i) => row.forEach((square, j) => square.position = {row:i, column: j}));
  }

  const setMines = (squares: ISquare[][]) => {
    const {mines} = gameConfigs;
    
    let minesToPlace = mines;
    while(minesToPlace > 0){
      minesToPlace = fillWithMinesRandomly(squares, minesToPlace);
    }
  }

  const fillWithMinesRandomly = (squares: ISquare[][], minesToPlace: number):  number => {
    const {rows, columns} = gameConfigs;
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

  const createGameStatus = () => {
    const gameStatus: GameStatus ={
      gameOver: false,
      minesLeft: gameConfigs.mines,
      minesOpened: 0
    }
    setGameStatus(gameStatus);
  }

  function setClickListener() {
    // if(!gameOver)
      // return false;

    // document.body.addEventListener()
    
  }
  
  const handleOpening = (row: number, column: number) => {
    const {hasMine, isOpen, minesAround} = squares[row][column];
    
    if(isOpen)
      return false;

    if(hasMine || minesAround === 0)
      shakeElement("gameContainer");    

    if(hasMine){
      open(row, column);
      gameOver(row, column);  
    } else {
      openThisAndPlacesAround(row, column);
    }
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
  

  const gameOver = (row: number, column: number) => {
    const openedMine = squares[row][column];
    let updatedGameStatus = {...gameStatus};
    updatedGameStatus.gameOver = true;
    setGameStatus(updatedGameStatus);
    openAllMinesAround(openedMine.position);
  }

  const openAllMinesAround = (position: Position) => {
    const allMines = getAllMines();

    // opening the mines in this order is what makes the mines open in a circular pattern
    sortByDistanceFrom(position, allMines); 
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

  const openMinesWithDelay = (squaresArray: ISquare[]) => {
    setTimeout(() =>{
      if(squaresArray.length === 0)
        return false;
      
      openPosition(squaresArray[squaresArray.length - 1].position);
      squaresArray.pop();
      openMinesWithDelay(squaresArray);
    }, 150 + 50 * (squaresArray.length
      % 2), squaresArray);
  }
  
  const changeGameDifficulty = (newDifficulty: string) => {
    let newGameConfigs = gameConfigsOptions[newDifficulty];
    setGameConfigs(newGameConfigs);
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
                            handleOpening   = {handleOpening}  
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

function shakeElement(elementaClass: string){
  const element = document.getElementsByClassName(elementaClass)[0];
  const movementController = (time: number) => {
    return Math.sin(time)*2 / time;
  };
  let time = 0;
  doShake(element, movementController(time));
}

function doShake(element: Element, time: number){
  // if(time < 1)
  //   return false;
  // element.setAttribute("style", "tr")
  // setTimeout()
}

function setTranslate(element: HTMLCollectionOf<Element>, x: number){

}