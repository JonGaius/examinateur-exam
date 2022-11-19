import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';

const ErrorPage = () => {

    const dispatch = useDispatch()
    const {me, isLoading, isError, isSuccess, message} = useSelector(
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
        <MainLayout title={"Oupss!"} admin={me}>
            {
                (isSuccess && me) && (
                    <div className='sigepec-page'>
                        <div className='sigepec-page-header'>
                            <h1>😅</h1>
                            <h2>Ouppss!</h2>
                            <span>Erreur 404</span>
                        </div>
                        <EmptySection Illustration={SadIllustration}>
                            {"Page introuvable"}
                        </EmptySection>
                    </div>
                )
            }
        </MainLayout>
    );
};

export default ErrorPage;