import React from 'react';
import { FaFlag } from 'react-icons/fa';

import './styles.css';

interface IProps {
    flagsLeft: number;
}

const ShowFlagsLeft = (props: IProps) => {

    return(
        <>
        <div className="showFlagsContainer">
            <FaFlag  size={30} />
            <p>{props.flagsLeft}</p> 
        </div>
        </>
    );
    
}

export default ShowFlagsLeft;