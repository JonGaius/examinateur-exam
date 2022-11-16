import React, { useState } from 'react';
import EyeIcon from '../../../assets/icons/ui/EyeIcon';
import HideIcon from '../../../assets/icons/ui/HideIcon';

const AuthPasswordField = ({id, dvalue, fnc, children}) => {
    const [etat, setEtat] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType] = useState(true)

    const handleChange = (e) => {
        const valeur = e.target.value;
        if(valeur){
            document.getElementById(id).classList.add("is--focused")
            setMessage("")
            setEtat("")
        }else{
            document.getElementById(id).classList.remove("is--focused")
            setEtat("is--error")
            setMessage("Ce champs est obligatoire")
        }
        fnc(valeur)
    }

    return (
        <div className={`sigepec-textfield-auth ${etat}`}>
            <input type={type ? "password" : "text"} defaultValue={dvalue} onChange={handleChange} required />
            <label id={id}>
                {children}
            </label>
            <button type='button' onClick={() => setType(!type)}>
                {
                    type ? (
                        <HideIcon/>
                    ) : (
                        <EyeIcon/>
                    )
                }
            </button>
            {message && <span className='sigepec-textfield-auth__message'>{message}</span>}
        </div>
    );
};

export default AuthPasswordField;