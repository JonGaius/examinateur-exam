import React from 'react';

const Textfield = ({id,type, facultatif = false, dvalue, fnc, placeholder, children}) => {
    return (
        <div className='sigepec-textfield'>
            <label htmlFor={id}>{children + `${facultatif ? " (facultatif)" : ""} `}</label>
            {
                facultatif ?
                <input type={type} id={id} defaultValue={dvalue} onChange={(e) => fnc(e.target.value)} placeholder={placeholder} />   
                :
                <input type={type} id={id} defaultValue={dvalue} onChange={(e) => fnc(e.target.value)} required placeholder={placeholder} />
            }
        </div>
    );
};

export default Textfield;