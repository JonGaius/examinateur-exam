import React from 'react';

const SelectField = ({id,options, facultatif = false, dvalue, fnc, placeholder, children}) => {
    return (
        <div className='sigepec-textfield'>
            <label htmlFor={id}>{children + `${facultatif ? "(facultatif)" : ""} `}</label>
            {
                facultatif ?
                (
                    <>
                        <select id={id} value={dvalue} onChange={(e) => fnc(e.target.value)}>
                            <option value="">{placeholder}</option>
                            {
                                options && options.map((option, index) => (
                                    <option value={option.value} key={index}>
                                        {option.label}
                                    </option>
                                ))
                            }
                        </select>
                        {/* <span>facultatif</span> */}
                    </>
                )
                :
                <select id={id} value={dvalue} onChange={(e) => fnc(e.target.value)} required>
                    <option value="">{placeholder}</option>
                    {
                        options && options.map((option, index) => (
                            <option value={option.value} key={index}>
                                {option.label}
                            </option>
                        ))
                    }
                </select>
            }
        </div>
    );
};

export default SelectField;