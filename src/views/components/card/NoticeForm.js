import React from 'react';
import CancelIcon from '../../../assets/icons/ui/CancelIcon';

const NoticeForm = ({status, typo, Icon, children, title}) => {
    return (
        <div className={`sigepec-form-alert is--${status}`}>
            <div className='sigepec-form-alert__container'>
                <div className='sigepec-form-alert__icon'>
                    <Icon/>
                </div>
                <div className='sigepec-form-alert__text'>
                    <strong>{title}</strong>
                    <p>{children}</p>
                </div>
                {
                    typo && (
                        <div className='sigepec-form-alert__close' onClick={() => {
                            document.querySelector(".sigepec-form-alert").style.display = "none"
                        }}>
                            <CancelIcon/>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default NoticeForm;