import React from 'react';

const EmptySection = ({Illustration, children}) => {
    return (
        <div className='sigepec-stateContainer'>
            <div className='sigepec-stateContainer__container'>
                <Illustration/>
                <strong>{children}</strong>
            </div>
        </div>
    );
};

export default EmptySection;