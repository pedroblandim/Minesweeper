import React, {useState, MouseEvent} from 'react';
import { GiUnlitBomb } from 'react-icons/gi';
import { FaFlag } from 'react-icons/fa';
import './styles.css';

interface IProps {
    row: number;
    column: number;
    minesAround: number;
    hasMine: Boolean;
    opened: Boolean;
    SweepMine: (row: number, column: number) => void;
}

interface CurrentImage{
    image: JSX.Element | string;
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

const Mine: React.FC<IProps> = (props) => {
    
    const backgroundColor =  (props.row + props.column) % 2 === 0 ? "dark" : "light";

    const {row, column, hasMine, minesAround, opened} = props;

    const [flag, setFlag] = useState<Boolean>(false);

    const open = () => {
        if(!props.opened){
            props.SweepMine(row, column);
        }
        return false;
    };

    function updateFlag(event: MouseEvent<HTMLTableDataCellElement, globalThis.MouseEvent>){
        event.preventDefault();
        setFlag(!flag);
    }

    function getCurrentImage(){
        // if(row === 10 && column === 10)
        //     return <FaFlag  />;
        if(opened){
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
            if(flag){
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
        style={flag && !opened ? {} : {color:numbersColors[minesAround]}} 
        className={`mine ${props.hasMine ? "bomb" : ""} ${props.opened ? "opened" : "closed"} ${backgroundColor}`} 
        onClick={flag ? () => false : open}  
        onContextMenu={updateFlag} 
        >
            {getCurrentImage()}

        </td>
        );
}

export default Mine;