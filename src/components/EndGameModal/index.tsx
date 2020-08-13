import React from 'react';
import { RiRestartLine } from 'react-icons/ri';
import { FcClock } from 'react-icons/fc';
import { FaTrophy } from 'react-icons/fa';


import './styles.css';

interface IProps{
    isOpen: Boolean;
    isGameOver: Boolean;
    restartGame: () => void;
    time: number;
    recordTime: number
}

const EndGameModal:React.FC<IProps> = (props:IProps) => {
    const {isGameOver, isOpen, time, recordTime, restartGame} = props;

    function formatTime(seconds: number):string{
        if(seconds === 0) return "___"; // no record set yet
        let formattedSeconds = seconds.toString();
        formattedSeconds = "0".repeat(3 - formattedSeconds.length) + formattedSeconds;
        
        return formattedSeconds;
    }

    return <div className={`endGameModal ${isOpen ? "openedModal" : "closedModal"}` }>
            <div className={`centralContainer ${isGameOver ? "gameOverContainer" : "gameWonContainer"}`} >
                <h1 className={isGameOver ? "gameOverHeader" : "wonGameHeader"}>
                    {isGameOver ? "GAME OVER" : "YOU WON!"}
                </h1>
                <div className="scoresContainer">
                <div >
                    <FcClock  size={30} />
                    <p>{isGameOver ? "___" : formatTime(time)}</p> 
                </div>
                <div >
                    <FaTrophy  size={30} />
                    <p>{formatTime(recordTime)}</p> 
                </div>
                </div>
                <button className="restartButton" 
                        onClick={restartGame}>
                    <p>Restart</p> < RiRestartLine />
                </button>
            </div>
        </div>
}

export default EndGameModal;