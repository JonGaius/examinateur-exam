import React from 'react';

const FormButton = ({mStyle, type, children}) => {
    return (
        <button type={type} className={`sigepec-button sigepec-button--${mStyle}`}>
            {children}
        </button>
    );
};

export default FormButton;