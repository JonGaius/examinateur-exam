import React from 'react';
import { Link } from 'react-router-dom';

const ModuleItem = ({link, Icon, children}) => {
    return (
        <Link to={link} className="sigepec-module-card">
            <div className='sigepec-module-card__icon'>
                <Icon/>
            </div>
            <div className='sigepec-module-card__text'>
                {children}
            </div>
        </Link>
    );
};

export default ModuleItem;