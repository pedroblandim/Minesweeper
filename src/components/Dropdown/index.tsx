import React, {useState} from 'react';
import './styles.css';

interface IProps {
    selected:string;
    options: string[];
    handleChange: (value:string) => void;
}

const Dropdown:React.FC<IProps> = (props:IProps) => {

    const [isOpen, setIsOpen] = useState<Boolean>(false);

    const callChangeHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        let newValue = event.currentTarget.innerText; 
        props.handleChange(newValue);
        setIsOpen(false);
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
        <div className="dropdownContainer" >
            <div className="dropdownSelector" onClick={toggleDropdown}>
                {props.selected}
            </div>
            <div className={`dropdownOptions ${isOpen ? "" : "closed"}`}>
            {props.options.map((option, i) => {
                return (
                    <div key={i} 
                        className={`dropdownOption ${option === props.selected ? "selected" : ""}`} 
                        onClick={option === props.selected ? () => false : callChangeHandler}
                        >
                                {option}
                    </div>
                        );
            })}
            </div>
        </div>

        </>
    );
}

export default Dropdown;