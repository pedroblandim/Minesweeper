import React, {useEffect, useState, useRef} from 'react';
import './styles.css';
import Timer from '../Timer';
import Dropdown from '../Dropdown';

interface IProps {
    gameOver: Boolean;
    mines: number;
    flagsLeft: number;
    changeGameDifficulty: (difficulty:string) => void;
    difficulties: string[];
}

const ConfigBar:React.FC<IProps> = (props:IProps) => {

    const [gameOver, setGameOver] = useState<Boolean>(props.gameOver);

    const timerRef = useRef<Timer>(null);


    const changeDifficulty = (newDifficulty: string) => {
        props.changeGameDifficulty(newDifficulty);
        if(timerRef && timerRef.current)
            timerRef.current.restart();
    }

    useEffect(() => {
        setGameOver(props.gameOver);
    })

    useEffect(() => {
        if(gameOver && timerRef && timerRef.current)
            timerRef.current.stop();
        else if(!gameOver && timerRef && timerRef.current)
            timerRef.current.restart();
        
    }, [gameOver]);

    return(
        <div className="configContainer" >
            < Timer ref={timerRef} />
            
            < Dropdown options={props.difficulties} 
                       handleChange={changeDifficulty} 
                        />
            
        </div>
    );

}

export default ConfigBar;
