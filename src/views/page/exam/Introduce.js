import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DangerIcon from '../../../assets/icons/ui/DangerIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { links } from '../../../router/constant';
import FormButton from '../../components/button/FormButton';
import NoticeForm from '../../components/card/NoticeForm';
import EmptySection from '../../components/container/EmptySection';
import Textfield from '../../components/textfield/Textfield';
import MainLayout from '../../layout/MainLayout';

const Introduce = () => {
    const {state} = useLocation()

    const [codeTV, setCodeTV] = useState('');
    const [errors, setErrors] = useState('');
    let navigate = useNavigate()

 

    const establishmentConnection = (e) => {
        e.preventDefault()

        if(codeTV){
            setErrors("")
            
            navigate(links.examAppel, {
                state: {
                    codeTV,
                    salle: state.details.salle,
                    exam: state
                }
            })
        }else{
            setErrors("Veuillez renseigner tous les champs")
        }
    }

    const dispatch = useDispatch()
    const {me, isLoading, isError, message} = useSelector(
        (state) => state.auth
    )
    useEffect(() => {
        if(!state){
            navigate(-1)
        }
        dispatch(getMe())
        
        return () => {
            dispatch(reset())
        }
    },[dispatch, state, navigate])

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
        <MainLayout title={"Deroulement de l'examen"} admin={me}>
            <div className='sigepec-page'>
                <div className='sigepec-page-header'>
                    <h1>📖</h1>
                    <h2>Connexion avec l'écran géant </h2>
                </div>
                <div className='sigepec-page-content'>
                    <form onSubmit={establishmentConnection} className="sigepec-page-form">               
                        <div className='sigepec-page-form__container'>
                            {
                                errors && (
                                    <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                                        {errors}
                                    </NoticeForm>
                                )
                            }
                            <div className='sigepec-page-form__group'>
                                <Textfield id={"code"} type={"text"} dvalue={codeTV} fnc={setCodeTV} placeholder={"Entrer le code TV"}>
                                    Code TV
                                </Textfield>
                            </div>
                            
                            <div className='sigepec-page-form__actions'>
                                {/* <div className='sigepec-page-form__action'>
                                    <button type={"reset"} className={`sigepec-button`} onClick={() => initFormState()}>
                                        Effacer
                                    </button>
                                </div> */}
                                <div className='sigepec-page-form__action'>
                                    <FormButton type={"submit"} mStyle={"primary"}>
                                        Etablir la connexion
                                    </FormButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default Introduce;