import React from 'react';
import { Link } from 'react-router-dom';

const LinkButton = ({link, mStyle, children}) => {
    return (
        <Link to={link} className={`sigepec-button sigepec-button--${mStyle}`}>
            {children}
        </Link>
    );
};

export default LinkButton;