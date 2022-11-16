import React from 'react';

const Textarea = ({id, facultatif = false, dvalue, fnc, placeholder, children}) => {
    return (
        <div className='sigepec-textfield'>
            <label htmlFor={id}>{children}</label>
            {
                facultatif ?
                (
                    <>
                        <textarea id={id} defaultValue={dvalue} onChange={(e) => fnc(e.target.value)} placeholder={placeholder} />
                        <span>facultatif</span>
                    </>
                )
                :
                <textarea id={id} defaultValue={dvalue} onChange={(e) => fnc(e.target.value)} required placeholder={placeholder} />
            }
        </div>
    );
};

export default Textarea;