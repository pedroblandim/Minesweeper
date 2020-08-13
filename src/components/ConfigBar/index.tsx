import React, {useEffect, useState, useRef} from 'react';
import './styles.css';
import Timer from '../Timer';
import ShowFlagsLeft from '../ShowFlagsLeft';
import Dropdown from '../Dropdown';


interface IProps {
    mines: number;
    gameFinished: Boolean;
    
    flagsLeft: number;
    difficulty: string;
    difficulties: string[];
    changeGameDifficulty: (difficulty:string) => void;
    time: number;
    setTime: (time: number) => void;
}

const ConfigBar:React.FC<IProps> = (props:IProps) => {

    const [gameFinished, setGameFinished] = useState<Boolean>(props.gameFinished);

    const timerRef = useRef<Timer>(null);


    const changeDifficulty = (newDifficulty: string) => {
        props.changeGameDifficulty(newDifficulty);
        if(timerRef && timerRef.current)
            timerRef.current.restart();
    }

    useEffect(() => {
        setGameFinished(props.gameFinished);
    }, [props.gameFinished]);

    useEffect(() => {
        if(gameFinished && timerRef && timerRef.current)
            timerRef.current.stop();
        else if(!gameFinished && timerRef && timerRef.current)
            timerRef.current.restart();
        
    }, [gameFinished]);
    
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
