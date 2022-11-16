import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useLocation, useNavigate } from 'react-router-dom';
import CheckIcon from '../../../assets/icons/ui/CheckIcon';
import DangerIcon from '../../../assets/icons/ui/DangerIcon';
import StartIcon from '../../../assets/icons/ui/StartIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { links } from '../../../router/constant';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';

const Test = () => {
    const {state} = useLocation()
    let navigate = useNavigate()
    const dispatch = useDispatch()
    const {me, isLoading, isError, message} = useSelector(
        (state) => state.auth
    )
    useEffect(() => {
        if(!state){
            navigate(links.home)
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
        <MainLayout title={"Demarrer la composition"} admin={me}>
            <div className='sigepec-page'>
                <div className='sigepec-page-header'>
                    <div className='sigepec-page-createSteps'>
                        <strong >Check In</strong>  - <strong className='active'>Composition</strong>
                    </div>
                </div>
                
                <div className='sigepec-page-content'>
                    <div className='sigepec-page-content__start sigepec-page-content-start'>
                        <button type="button" onClick={() => {
                            navigate(links.examComposition, {
                                state: state
                            })
                        }} className='sigepec-page-content-start__container'>
                            <div className='sigepec-page-content-start__icon'>
                                <StartIcon/>
                            </div>
                            <div className='sigepec-page-content-start__text'>
                                <strong>Démarrer la composition l'examen</strong>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='sigepec-module-list'>
                    <div className='sigepec-module-list__item'>
                        <div className="sigepec-module-card is--success">
                            <div className='sigepec-module-card__icon'>
                                <CheckIcon/>
                            </div>
                            <div className='sigepec-module-card__text'>
                                <span>Présent</span>
                                <br />
                                <strong>{state && state.list.filter(el => el.presence === true).length}</strong>
                            </div>
                        </div>
                    </div>
                    <div className='sigepec-module-list__item'>
                        <div className="sigepec-module-card is--danger">
                            <div className='sigepec-module-card__icon'>
                                <DangerIcon/>
                            </div>
                            <div className='sigepec-module-card__text'>
                                <span>Absent</span>
                                <br />
                                <strong>{state && state.list.filter(el => el.presence === false).length}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Test;