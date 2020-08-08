import React, {useState, useEffect} from 'react';
import './styles.css';
import { FcClock } from 'react-icons/fc'


interface timerProps{
    initialSeconds: number;
    stop: Boolean;
}

const Timer:React.FC<timerProps> = (props:timerProps) => {

    const [seconds, setSeconds] = useState<number>(props.initialSeconds);
    
    useEffect(() => {
        
        let id = setTimeout(updateTime, 1000);
        
        if(props.stop)
            clearTimeout(id);
        
    },[seconds])

    const updateTime = () => {
        setSeconds(seconds + 1);
    } 

    return(
        <>
        <div className="timerContainer">
            <FcClock  size={30} />
            <p>{seconds}</p> 
        </div>
        </>
    );
}

export default Timer;