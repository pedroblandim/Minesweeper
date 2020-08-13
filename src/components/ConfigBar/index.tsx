import React, {useEffect, useState, useRef} from 'react';
import './styles.css';
import Timer from '../Timer';
import ShowFlagsLeft from '../ShowFlagsLeft';
import Dropdown from '../Dropdown';


interface IProps {
    mines: number;
    gameOver: Boolean;
    flagsLeft: number;
    difficulty: string;
    difficulties: string[];
    changeGameDifficulty: (difficulty:string) => void;
    time: number;
    setTime: (time: number) => void;
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
    }, [props.gameOver]);

    useEffect(() => {
        if(gameOver && timerRef && timerRef.current)
            timerRef.current.stop();
        else if(!gameOver && timerRef && timerRef.current)
            timerRef.current.restart();
        
    }, [gameOver]);
    
    return(
        <div className="configContainer" >
            < Timer 
                    ref={timerRef} 
                    time={props.time}
                    setTime={props.setTime}
                    />
            
            < ShowFlagsLeft flagsLeft={props.flagsLeft} />

            < Dropdown  selected={props.difficulty}
                        options={props.difficulties} 
                        handleChange={changeDifficulty} 
                        />
            
        </div>
    );

}

export default ConfigBar;
