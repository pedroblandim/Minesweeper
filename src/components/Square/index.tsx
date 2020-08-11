import React, {useState, MouseEvent} from 'react';
import { GiUnlitBomb } from 'react-icons/gi';
import { FaFlag } from 'react-icons/fa';
import './styles.css';


interface IProps {
    position: {row:number, column: number};
    minesAround: number;
    hasMine: Boolean;
    isOpen: Boolean;
    hasFlag: Boolean;
    handleOpening: (position: {row: number, column: number}) => void;
    toggleFlag: (position:{row: number, column: number}) => void;
}


const numbersColors:{[key: number]: string} = {
    1: "#1a76d1", 
    2: "#388e3c",
    3: "red",
    4: "#7b1fa2",
    5: "red",
    6: "red",
    7: "red",
    8: "red" 
}

const Square: React.FC<IProps> = (props) => {

    const {position, hasMine, minesAround, isOpen, hasFlag} = props;

    const backgroundColor =  (position.row + position.column) % 2 === 0 ? "dark" : "light";
    
    const open = () => {
        if(!isOpen){
            props.handleOpening(position);
        }
        return false;
    };
    
    const handleRightClick = (event: MouseEvent<HTMLTableDataCellElement, globalThis.MouseEvent>) => {
        event.preventDefault();
        props.toggleFlag(position);
    }

    function getCurrentImage(){
        if(isOpen){
            if(hasMine)
                return  (
                    <div style={{display:"flex", verticalAlign:"middle", justifyContent:"center"}}>
                        <GiUnlitBomb size={26} color={"rgb(20, 20, 20)"} />
                    </div>
                );

            else if(minesAround === 0)
                return "";
            else
                return minesAround;
        } else {
            if(hasFlag) {
                return  (
                    <div style={{display:"flex", verticalAlign:"middle", justifyContent:"center"}}>
                        <FaFlag color="rgb(231, 42, 42)" />
                    </div>
                );
            }

            else
                return "";
        }

    }

    return (
        <td 
        style={hasFlag && !isOpen ? {} : {color:numbersColors[minesAround]}} 
        className={`square ${isOpen ? "opened" : "closed"} ${backgroundColor}`} 
        onClick={hasFlag ? () => false : open}  
        onContextMenu={handleRightClick} 
        >
            {getCurrentImage()}

        </td>
        );
}

export default Square;