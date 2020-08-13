import React from 'react';
import './styles.css';
import { FcClock } from 'react-icons/fc';


interface IProps {
    time: number;
    setTime: (time: number) => void;
}

interface Timer {
    timerId: NodeJS.Timeout;
}

class Timer extends React.Component<IProps, {}> {

    componentDidMount() {
        this.start();
    }

    componentWillUnmount(){
        this.stop();
    }

    tick() {
        this.props.setTime(this.props.time + 1);
    }

    start(){
        this.stop();
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    restart(){
        this.props.setTime(0);
        this.start();
    }

    stop(){
        clearInterval(this.timerId);
    }

    render() {
        return(
            <>
            <div className="timerContainer">
                <FcClock  size={30} />
                <p>{this.props.time}</p> 
            </div>
            </>
        );
    }
}


export default Timer;