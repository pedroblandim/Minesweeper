import React, {useState, useEffect} from 'react';
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

    const [seconds, setSeconds] = useState<number>(0);

    const changeDifficulty = (newDifficulty: string) => {
        props.changeGameDifficulty(newDifficulty);
        setSeconds(0);
    }

    return(
        <div className="configContainer" >
            < Timer initialSeconds={seconds} 
                    stop={props.gameOver} 
                    />
            
            < Dropdown options={props.difficulties} 
                       handleChange={changeDifficulty} 
                        />
            
        </div>
    );

}

export default ConfigBar;


const Score:React.FC = () => {


    return(
        <div>Score</div>
    );
}