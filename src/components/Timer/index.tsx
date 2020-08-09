import React from 'react';
import './styles.css';
import { FcClock } from 'react-icons/fc'



interface TimerState {
    seconds: number;

}

interface Timer {
    timerId: NodeJS.Timeout;
}

class Timer extends React.Component<{}, TimerState> {
    
    constructor(props:{}){
        super(props);
        this.state = {
            seconds: 0
        };
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount(){
        this.stop();
    }

    tick() {
        this.setState({
            seconds: this.state.seconds + 1
        })
    }

    start(){
        this.stop();
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    restart(){
        this.setState({
            seconds: 0
        });
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
                <p>{this.state.seconds}</p> 
            </div>
            </>
        );
    }
}


export default Timer;