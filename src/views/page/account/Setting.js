import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckIcon from '../../../assets/icons/ui/CheckIcon';
import DangerIcon from '../../../assets/icons/ui/DangerIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset, updateInfos, updatePassword } from '../../../features/auth/authSlice';
import { links } from '../../../router/constant';
import FormButton from '../../components/button/FormButton';
import NoticeForm from '../../components/card/NoticeForm';
import EmptySection from '../../components/container/EmptySection';
import Textfield from '../../components/textfield/Textfield';
import MainLayout from '../../layout/MainLayout';

const InfoEditForm = ({me, fnc}) => {

    const [name, setName] = useState(me.nom);
    const [prename, setPrename] = useState(me.prenom);
    const [email, setEmail] = useState(me.email);
    const [phone, setPhone] = useState(me.telephone);
    const [service, setService] = useState(me.service);
    const [matricule, setMatricule] = useState(me.numero_matricule);
    const dispatch = useDispatch()

    // const initFormState = () => {
    //     setName("")
    //     setPrename("")
    //     setEmail("")
    //     setService("")
    //     setPhone("")
    //     setMatricule("")
    // }

    const handleEdit = (e) => {
        e.preventDefault()
        if(name && prename && email && phone && service && matricule){
            fnc("")
            const data = {
                nom: name,
                prenom: prename,
                numero_matricule: matricule,
                telephone: phone,
                email: email,
                service: service,
                slug: me.slug
            }
            dispatch(updateInfos(data))
        }else{
            fnc("Veuillez remplir tous les champs")
        }
    }

    return (
        <form onSubmit={handleEdit} className="sigepec-page-form">
                            
            <div className='sigepec-page-form__container'>
                <strong>Mes informations</strong>
                <div className='sigepec-h-bar'></div>
                <div className='sigepec-page-form__group'>
                    <Textfield id={"nom"} type={"text"} dvalue={name} fnc={setName} placeholder={"Entrer le nom de famille"}>
                        Nom
                    </Textfield>

                    <Textfield id={"prenom"} type={"text"} dvalue={prename} fnc={setPrename} placeholder={"Entrer le/les prénom(s)"}>
                        Prénom(s)
                    </Textfield>
                </div>
                <div className='sigepec-page-form__group'>
                    <Textfield id={"matricule"} type={"text"} dvalue={matricule} fnc={setMatricule} placeholder={"Entrer le numéro matricule"}>
                        Numéro matricule
                    </Textfield>
                    <Textfield id={"service"} type={"text"} dvalue={service} fnc={setService} placeholder={"Entrer l'agrement de l'auto-école"}>
                        Service
                    </Textfield>
                </div>
                <div className='sigepec-page-form__group'>
                    <Textfield id={"phone"} type={"text"} dvalue={phone} fnc={setPhone} placeholder={"Entrer le numéro de téléphone"}>
                        Téléphone
                    </Textfield>
                    
                    <Textfield id={"email"} type={"email"} dvalue={email} fnc={setEmail} placeholder={"Entrer l'email"}>
                        Email
                    </Textfield>
                </div>
                
            </div>
            <div className='sigepec-page-form__actions'>
                {/* <div className='sigepec-page-form__action'>
                    <button type={"reset"} className={`sigepec-button`} onClick={() => initFormState()}>
                        Effacer
                    </button>
                </div> */}
                <div className='sigepec-page-form__action'>
                    <FormButton type={"submit"} mStyle={"primary"}>
                        Enrégistrer
                    </FormButton>
                </div>
            </div>
        </form>
    )
}
const PasswordEditForm = ({me,fnc}) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch()
    // const initFormState = () => {
    //     setPassword("")
    //     setNewPassword("")
    //     setConfirmPassword("")
    // }
    const handleEdit = (e) => {
        e.preventDefault()
        if(password && newPassword && confirmPassword){
            fnc("")
            const data = {
                old_password: password,
                new_password: newPassword,
                confirm_new_password: confirmPassword,
                slug: me.slug
            }
            dispatch(updatePassword(data))
        }else{
            fnc("Veuillez remplir tous les champs")
        }
    }
    return (

        <form onSubmit={handleEdit} className="sigepec-page-form">
                            
            <div className='sigepec-page-form__container'>
                <strong>Mot de passe</strong>
                <div className='sigepec-h-bar'></div>
                <div className='sigepec-page-form__group'>
                    <Textfield id={"new-password"} type={"password"} dvalue={newPassword} fnc={setNewPassword} placeholder={"Entrer le nouveau mot de passe"}>
                    Nouveau mot de passe
                    </Textfield>
                </div>
                <div className='sigepec-page-form__group'>
                    <Textfield id={"confirme-password"} type={"password"} dvalue={confirmPassword} fnc={setConfirmPassword} placeholder={"Confirmer votre nouveau mot de passe"}>
                       Confirmation du nouveau mot de passe
                    </Textfield>
                </div>
                <div className='sigepec-page-form__group'>
                    <Textfield id={"password"} type={"password"} dvalue={password} fnc={setPassword} placeholder={"Entrer votre ancien mot de passe"}>
                        Ancien mot de passe
                    </Textfield>
                </div>
                
            </div>
            <div className='sigepec-page-form__actions'>
                {/* <div className='sigepec-page-form__action'>
                    <button type={"reset"} className={`sigepec-button`} onClick={() => initFormState()}>
                        Effacer
                    </button>
                </div> */}
                <div className='sigepec-page-form__action'>
                    <FormButton type={"submit"} mStyle={"primary"}>
                        Enrégistrer
                    </FormButton>
                </div>
            </div>
        </form>
    )
}

const Setting = () => {
    const [errors, setErrors] = useState('');

    const dispatch = useDispatch()
    const {me, isLoading, isError, isSuccess,isEditSuccess,isEditError,isEditLoading, message} = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        dispatch(getMe())
        return () => {
            dispatch(reset())
        }
    },[dispatch])
    if(isLoading){
        return (
            <div className='sigepec-big-load'>
                <div className='load'></div>
            </div>
        )
    }
    if(isError){
        return (
            <EmptySection Illustration={SadIllustration}>
                {message}
            </EmptySection>
        )
    }

    return (
        <MainLayout title={"Paramètre du compte"} admin={me}>
            <div className='sigepec-page'>
                <div className='sigepec-page__container2'>
                    <div className='sigepec-filedarianne'>
                        <Link to={links.home}>Accueil</Link> / <span>Paramètre du compte</span>
                    </div>

                    <div className='sigepec-page-header2'>
                        <div className='sigepec-page-title2'>
                            <h2>Paramètre du compte</h2>
                        </div>
                    </div>

                    <div className='sigepec-page-formulaire'>
                            {
                                isEditError && (
                                    <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                                        {message}
                                    </NoticeForm>
                                )
                            }
                            {
                                errors && (
                                    <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                                        {errors}
                                    </NoticeForm>
                                )
                            }
                            {
                                isEditLoading && (
                                    <div className={`sigepec-form-alert is--load`}>
                                        <div className='sigepec-form-alert__container'>
                                            <div className='sigepec-form-alert__icon'>
                                                <div className='load'></div>
                                            </div>
                                            <div className='sigepec-form-alert__text'>
                                                <strong>{"Modification du compte en cours"}</strong>
                                                <p>{"Veuillez patienter un instant..."}</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                )
                            }
                            {
                                isEditSuccess && (
                                    <NoticeForm status={"success"} Icon={CheckIcon} typo={true} title={"Succès!!"}>
                                        {"Les informations ont bien été mises à jour"}
                                    </NoticeForm>
                                )
                            }
                        
                            {
                                isSuccess && me && (
                                    <>
                                        <InfoEditForm me={me} fnc={setErrors}/>
                                        <br />
                                        <br />
                                        <PasswordEditForm me={me} fnc={setErrors}/>
                                    </>
                                )
                            }
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Setting;