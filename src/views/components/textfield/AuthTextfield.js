import React, { useState } from 'react';

const AuthTextfield = ({id, dvalue, type, fnc, children}) => {
    const [etat, setEtat] = useState("")
    const [message, setMessage] = useState("")

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
            <input type={type} defaultValue={dvalue} onChange={handleChange} required />
            <label id={id}>
                {children}
            </label>
            {message && <span className='sigepec-textfield-auth__message'>{message}</span>}
        </div>
    );
};

export default AuthTextfield;