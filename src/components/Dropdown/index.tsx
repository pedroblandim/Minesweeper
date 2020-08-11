import React, {useState, useEffect} from 'react';
import './styles.css';

interface IProps {
    options: string[];
    handleChange: (value:string) => void;
}

const Dropdown:React.FC<IProps> = (props:IProps) => {

    const [isOpen, setIsOpen] = useState<Boolean>(false);

    const [value, setValue] = useState<string>(props.options[0]);


    const callChangeHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        let newValue = event.currentTarget.innerText; 
        setValue(newValue);
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
                {value}
            </div>
            <div className={`dropdownOptions ${isOpen ? "" : "closed"}`}>
            {props.options.map((option, i) => {
                return (
                    <div key={i} 
                        className={`dropdownOption ${option === value ? "selected" : ""}`} 
                        onClick={option === value ? () => false : callChangeHandler}
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