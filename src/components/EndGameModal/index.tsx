import React from 'react';
import { RiRestartLine } from 'react-icons/ri';

import './styles.css';
import Dropdown from '../Dropdown';

interface IProps{
    isOpen: Boolean;
    isGameOver: Boolean;
    restartGame: () => void;
    time: number;
    score: number;
}

const EndGameModal:React.FC<IProps> = (props:IProps) => {

    const getModalHeader = () => {
        return "Game Over"
    }

    return <div className={`gameOverModal ${props.isOpen ? "openedModal" : "closedModal"}` }>
            <div className="centralContainer">
                <h1 className={props.isGameOver ? "gameOverHeader" : "wonGameHeader"}>{getModalHeader()}</h1>
                <div>Time: {props.time} </div>
                <div>Score: {props.score} <p></p></div>
                <button className="restartButton" 
                        onClick={props.restartGame}>
                    <p>Restart</p> < RiRestartLine />
                </button>
                {/* < Dropdown options={["easy"]}
                            handleChange={() => false}
                            /> */}
            </div>
        </div>
}

export default EndGameModal;