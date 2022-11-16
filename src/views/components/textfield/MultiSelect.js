import React from 'react';
import Select from 'react-select';

const MultiSelect = ({id,options, fnc,facultatif = false, children, placeholder}) => {
    return (
        <div className='sigepec-textfield'>
            <label htmlFor={id}>{children + `${facultatif ? "(facultatif)" : ""} `}</label>
            {
                facultatif ?
                (
                   
                    <Select 
                        // className='is--large select' 
                        placeholder={placeholder}
                        isSearchable={true} 
                        isMulti 
                        isClearable={true} 
                        options={options} 
                        onChange = {(item) => fnc(item)}
                    />
                )
                : (
                   
                    <Select 
                        // className='is--large select' 
                        placeholder={placeholder}
                        isSearchable={true} 
                        isMulti 
                        isClearable={true} 
                        options={options} 
                        onChange = {(item) => fnc(item)}
                    />
                )
               
            }
        </div>
    );
};

export default MultiSelect;