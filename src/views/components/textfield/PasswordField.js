import React, { useState } from 'react'

export default function PasswordField({id, confirm = "", dvalue, fnc, placeholder, children}) {
    const [mess, setMess] = useState("Le mot de passe doit contenir au moins 8 charactères alphanumériques, au moins un chiffre, au moins un charactère spéciale, au moins une lettre en majuscule, une lettre miniscule")
    const [mess2, setMess2] = useState("Les mots de passe ne se correspondent pas")

    const handleChange = (e) => {
        let value = e.target.value
        fnc(value)
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        // eslint-disable-next-line no-useless-escape
        const hasSpecialCharacter = /[!@#\$%\^&]/.test(value);

        if(confirm){
           
            if(value === confirm){
                setMess2("")
            }else{
                setMess2("Les mots de passe ne se correspondent pas")
            }

        } else{

            if(value.length >= 1){
                let long = ""
                let upper = ""
                let lower = ""
                let special = ""
                let num = ""

                if(value.length < 8){
                    long = "- au moins 8 charactères alphanumériques"
                }else{
                    long = ""
                }

                if(!hasUpperCase){
                    upper = "- au moins une lettre en majuscules"
                }else{
                    upper = ""
                }

                if(!hasLowerCase){
                    lower = "- au moins une lettre en miniscule"
                }else{
                    lower = ""
                }

                if(!hasSpecialCharacter){
                    special = "- au moins un charactère spéciale"
                }else{
                    special = ""
                }

                if(!hasNumber){
                    num = "- au moins un chiffre"
                }else{
                    num = ""
                }
                if(value.length < 8 || !hasLowerCase || !hasNumber || !hasSpecialCharacter || !hasUpperCase) {
                    setMess("Le mot de passe doit contenir : " + long + upper + lower + special + num)
                }else{
                    setMess("")
                }

            }else{
                setMess("Le mot de passe doit contenir au moins 8 charactères alphanumériques, au moins un chiffre, au moins un charactère spéciale, au moins une lettre en majuscule, une lettre miniscule")
            }
        }
        
    }
  return (
    <div className='sigepec-textfield'>
        <label htmlFor={id}>{children}</label>
        <input type={'password'} id={id} value={dvalue} onChange={handleChange} required placeholder={placeholder} />
            {
                confirm === "" ? (
                    <span>{mess}</span>
                ) : (
                    <span>{mess2}</span>
                )
            }
    </div>
  )
}
