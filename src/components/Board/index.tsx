import React, {useState, useRef, useEffect} from 'react';
import Square from '../Square';
import './styles.css';


interface ISquare {
    minesAround: number;
    position: Position;
    hasMine: Boolean;
    isOpen: Boolean;
  
    hasFlag: Boolean;
  }

interface GameConfigs {
    rows: number;
    columns: number;
    mines: number;
}

interface IProps {
    gameConfigs: GameConfigs;

    gameOver:() => void;
    isGameWon: Boolean;
    gameWon: () => void;
    isGameOver: Boolean;
    
    updateFlagsLeft: (flagsLeft: number) => void;
    
    shakeGame: () => void;
}

interface Position {
    row: number;
    column: number;
}

const Board:React.FC<IProps> = (props: IProps) => {
 
  const defaultSquare     = {hasMine:false, isOpen: false, hasFlag: false, minesAround: 0, position:{row: 0, column: 0}};
  
  const [squares, setSquares]         = useState<ISquare[][]>([[defaultSquare]]);
  
  const [isGameWon, setIsGameWon]   = useState<Boolean>(false);
  const [isGameOver, setIsGameOver]   = useState<Boolean>(false);
  const gameOverRef = useRef<Boolean>(false);
  gameOverRef.current = isGameOver;

  
  const [areMinesSet, setAreMinesSet] = useState<Boolean>(false);
    
  const [flagsLeft, setFlagsLeft] = useState<number>(props.gameConfigs.mines);
  const [squaresClosed, setSquaresClosed] = useState<number>(props.gameConfigs.rows*props.gameConfigs.columns);

  useEffect(startGame, []);
  useEffect(startGame, [props.gameConfigs])
  useEffect(updateGameStatus, [props.isGameOver, props.isGameWon]);
  
  useEffect(updateSquaresClosed, [squares]);
  useEffect(updateFlagsLeft, [squares]);

  function startGame(){ // also restarts 
    setFlagsLeft(props.gameConfigs.mines);

    createSquares();
    setAreMinesSet(false); // the mines are set only at the first click
  }  

  function createSquares(){
    const {rows, columns} = props.gameConfigs;

    const squares = createEmptyMatrix<ISquare>(rows, columns, defaultSquare);
    setPositions(squares);
    setSquares(squares);
  }

  const setPositions = (squares: ISquare[][]) => {
    squares.forEach((row, i) => row.forEach((square, j) => square.position = {row:i, column: j}));
  }
  
    
  function updateGameStatus() {
    setIsGameOver(props.isGameOver);
    setIsGameWon(props.isGameWon);
    if((isGameOver && !props.isGameOver) || (isGameWon && !props.isGameWon)){ // restarting game
      startGame();
    } 
  }

  const handleOpening = (position: Position) => {
    const {row, column} = position;
    const {hasMine, isOpen, minesAround} = squares[row][column];
    
    if(isOpen || isGameOver || isGameWon) return false;
    
    if(!areMinesSet) setMines(position);

    if(hasMine || !minesAround) props.shakeGame();

    if(hasMine) {
      setIsGameOver(true);
      openMine(position); 
      setTimeout(() => setClickListener(), 100); // listen for the user click to open the end game modal
    }
    else openThisAndPlacesAround(position);
  }

  const setMines = (position: Position) => {
      setMinesAround(position);
      setNumbers(squares);
      setAreMinesSet(true);
  }

  const setMinesAround = (position: Position) => {
    const {mines} = props.gameConfigs;
    
    let minesToPlace = mines;
    while(minesToPlace > 0){
      minesToPlace = fillWithMinesRandomlyAround(position, minesToPlace);
    }
  }

  const fillWithMinesRandomlyAround = (position: Position, minesToPlace: number):  number => {
    const {rows, columns} = props.gameConfigs;
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
    const {rows:totalRows, columns:totalColumns} = props.gameConfigs;
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

  const openThisAndPlacesAround = (position: Position) => {
      const totalRows = squares.length;
      const totalColumns = squares[0].length;
      const {row, column} = position;
      const {hasMine, isOpen, minesAround, hasFlag} = squares[row][column];
  
  
      if(hasMine || isOpen) return false;
  
      openPosition(position);
  
      if(minesAround === 0){
  
        // call this function to the places on the left, right, top and bottom
        if(row + 1 < totalRows)
          openThisAndPlacesAround({row:row + 1,column});
  
        if(row - 1 >= 0)
          openThisAndPlacesAround({row:row - 1, column});
  
        if(column + 1 < totalColumns)
          openThisAndPlacesAround({row, column:column + 1});
  
        if(column - 1 >= 0)
          openThisAndPlacesAround({row, column: column - 1});
        
        // open the places on the corners
        if(row + 1 < totalRows && column + 1 < totalColumns && squares[row+1][column+1].minesAround !== 0)
          openPosition({row:row + 1, column: column + 1});
        
        if(row - 1 >= 0 && column + 1 < totalColumns && squares[row-1][column+1].minesAround !== 0)
          openPosition({row: row - 1, column: column + 1});
          
        if(row - 1 >= 0 && column - 1 >= 0 && squares[row-1][column-1].minesAround !== 0)
          openPosition({row: row - 1, column: column - 1});
        
        if(row + 1 < totalRows && column - 1 >= 0 && squares[row+1][column-1].minesAround !== 0)
          openPosition({row: row + 1,column: column - 1});
      }
  }


  function openPosition(position: Position){
    const {row, column} = position;
    let updatedSquares = [...squares];
    updatedSquares[row][column].isOpen  = true;
    updatedSquares[row][column].hasFlag = false;
    setSquares(updatedSquares);
  }
  

  const openMine = (position: Position) => {
    const {row, column} = position;
    const openedMine = squares[row][column];
      
    openPosition(position);
    openAllMinesAround(openedMine.position);
  }

  const openAllMinesAround = (position: Position) => {
      const allMines = getAllMines();

      // opening the mines in this order is what makes them open in a circular pattern
      sortByDistanceFrom(position, allMines); 
      openMinesWithDelay(allMines);
  }

  const setClickListener = () => {
    const gameContainer = document.getElementsByClassName("gameContainer")[0];
    gameContainer.addEventListener("click", listener);
  };

  const removeClickListener = () => {
    const gameContainer = document.getElementsByClassName("gameContainer")[0];
    gameContainer.removeEventListener("click", listener);
  }

  function listener() {
    props.gameOver();
    removeClickListener();
  }

  const getAllMines = (): ISquare[] => {
    const allMines:ISquare[] = [];
    const {rows, columns} = props.gameConfigs;

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
    
    if (!gameOverRef.current) return false; // game restarted
    
    if(squaresArray.length === 0){
      props.gameOver();
      return false;
    }

    openPosition(squaresArray[squaresArray.length - 1].position);
    squaresArray.pop();
    openMinesWithDelay(squaresArray);
    }, 150 + 50 * (squaresArray.length % 2), squaresArray);
  }



  function updateSquaresClosed(){ 
    let squaresClosed = squares.reduce((pv, row) => pv + row.reduce((pv, square) => pv + (!square.isOpen ? 1 : 0), 0), 0);
    setSquaresClosed(squaresClosed);
  }


  const toggleFlag = (position: Position) => {
    const {row, column} = position;
    const updatedSquares = squares;
    const square = squares[row][column];
    const hasFlag = square.hasFlag;
    
    if(square.isOpen || gameOverRef.current) return false;

    if(!hasFlag && flagsLeft <= 0) return false // no flags left
    
    updatedSquares[row][column].hasFlag = !hasFlag;
    setSquares(updatedSquares);
    updateFlagsLeft();
  }
  
  function updateFlagsLeft(){
      let flagsSet    = squares.reduce((pv, row) => pv + row.reduce((pv, square) => pv + (square.hasFlag ? 1 : 0), 0), 0);
      let flagsLeft   = props.gameConfigs.mines - flagsSet;
      props.updateFlagsLeft(flagsLeft);
      setFlagsLeft(flagsLeft);
  }



  return (<table>
    <tbody>
    {squares.map( (row, i) =>{
      return(
        <tr key={i} >
          {row.map((square, j) => {
            const {hasMine, minesAround, isOpen, position, hasFlag} = square;
            return <Square  key         = {`${i}x${j}`} 
                            position    = {position}
                            isOpen      = {isOpen} 
                            hasMine     = {hasMine} 
                            minesAround = {minesAround}
                            hasFlag     = {hasFlag}

                            handleOpening = {handleOpening}
                            toggleFlag    = {toggleFlag}      
                            />;
          })}
        </tr>)
    })}

    </tbody>
  </table>);
}
    
export default Board;

// Utils
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