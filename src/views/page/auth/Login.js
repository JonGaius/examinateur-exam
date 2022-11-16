import React, { useEffect, useState } from 'react';
import AuthLayout from '../../layout/AuthLayout';
import auth from "../../../assets/images/auth.png";
import NoticeForm from '../../components/card/NoticeForm';
import DangerIcon from '../../../assets/icons/ui/DangerIcon';
import AuthTextfield from '../../components/textfield/AuthTextfield';
import AuthPasswordField from '../../components/textfield/AuthPasswordField';
import FormButton from '../../components/button/FormButton';

import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { login } from '../../../features/auth/authSlice';
import {links} from "../../../router/constant";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState("")

    const [styleBtn, setStyleBtn] = useState("disable")
    const [messageBtn, setMessageBtn] = useState("Se connecter")

    let navigate = useNavigate();
    const dispatch = useDispatch()
    const {user, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.auth
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        if(email && password){
            setErrors("")
            setMessageBtn("Veuillez patienter un instant")
            setStyleBtn("disable")

            const data = {
                email,
                password
            }
            dispatch(login(data))
        }else{
            setErrors("Veuillez renseigner tous les champs...")
            setMessageBtn("Se connecter")
            setStyleBtn("disable")
        }
    }

    useEffect(() => {
        if(email && password){
            setStyleBtn("primary")
        }else{
            setStyleBtn("disable")
        }
        if(user){
            navigate(links.home)
        }
        if(isError){
            // setErrors(message)
            setMessageBtn("Se connecter")
            setStyleBtn('primary');
        }
        if(isSuccess){
            window.location.reload()
        }
        if(isLoading){
            setMessageBtn("Veuillez patienter un instant")
            setStyleBtn("disable")
        }
    },[email, password, user, navigate, isError,isSuccess, isLoading])

    return (
        <AuthLayout image={auth} title={"Connexion"} subtitle={"Accès réservés"}>
            <form className='sigepec-auth-form' onSubmit={handleSubmit}>

                {
                    errors && (
                        <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                            {errors}
                        </NoticeForm>
                    )
                }{
                    isError && (
                        <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                            {message}
                        </NoticeForm>
                    )
                }
                {
                    isLoading && (
                        <div className={`sigepec-form-alert is--load`}>
                            <div className='sigepec-form-alert__container'>
                                <div className='sigepec-form-alert__icon'>
                                    <div className='load'></div>
                                </div>
                                <div className='sigepec-form-alert__text'>
                                    <strong>{"Connexion en cours"}</strong>
                                    <p>{"Veuillez patienter un instant le temps que nous établissions une connexion..."}</p>
                                </div>
                                
                            </div>
                        </div>
                    )
                }

                <div className='sigepec-auth-form__container'>
                    <AuthTextfield id={"email"} dvalue={email} fnc={setEmail} type="email">
                        Email
                    </AuthTextfield>
                    <AuthPasswordField id={"password"} dvalue={password} fnc={setPassword}>
                        Mot de passe
                    </AuthPasswordField>
                </div>
                <div className='sigepec-auth-form__action'>
                    <FormButton type={"submit"} mStyle={styleBtn}>
                        {messageBtn}
                    </FormButton>
                </div>
                <div className='sigepec-auth-form__info'>
                    <p><a href="mailto:admin-sigepec@dgttm.com" target={"_blank"} rel="noreferrer">Mot de passe oublié?</a></p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;