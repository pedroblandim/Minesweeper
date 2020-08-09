import React from 'react';

import './styles.css';

interface IProps{
    isOpen: Boolean;
}

const GameOverModal:React.FC<IProps> = (props:IProps) => {


    return <div className={`gameOverModal ${props.isOpen ? "opened" : "closed"}` }>
            <div className="options">
                <button className="restart">
                    Restart
                </button>
            </div>
        </div>
}

export default GameOverModal;