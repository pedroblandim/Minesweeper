import React, {useState, useEffect} from 'react';

interface IProps {
    options: string[];
    handleChange: (value:string) => void;
}

const Dropdown:React.FC<IProps> = (props:IProps) => {

    const [value, setValue] = useState<string>("");

    useEffect(() => {
        setValue(props.options[0]);
    }, [props.options]);

    const callChangeHandler = (event:React.ChangeEvent<HTMLSelectElement>) => {
        let newValue = event.target.value; 
        setValue(newValue);
        props.handleChange(newValue);
    }

    return (
        <select value = {value} 
                onChange={(event) => callChangeHandler(event)} 
                >
            {props.options.map((option, i) => {
                return <option key={i} >{option}</option>
            })}
        </select>
    );
}

export default Dropdown;