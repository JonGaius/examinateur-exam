import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { getSujets } from '../../../features/examens/examenSlice';
import { links } from '../../../router/constant';
import EmptySection from '../../components/container/EmptySection';
// import QuestionContainer from '../../components/container/QuestionContainer';

import MainLayout from '../../layout/MainLayout';
import io from "socket.io-client"
import { WEBSOCKETURL } from '../../../utils/constant';
import RenewQuestion from './RenewQuestion';


const socket = io.connect(WEBSOCKETURL)

const Composition = () => {
    const {state} = useLocation()
    const dispatch = useDispatch()
    const {me, isLoading, isError, message} = useSelector(
        (state) => state.auth
    )
    const {sujets, isSujetLoading, isSujetError, isSujetSuccess} = useSelector(
        (state) => state.examen
    )
    const examState = useSelector(
        (state) => state.examen
    )
    let navigate = useNavigate()
    const [question, setQuestion] = useState(0)

    const join_room1 = useCallback(
        () => {
            if(state){
                let data = {
                    room: state.codeTV,
                    salle: state.salle
                }
                // console.log(room.split(","))
                socket.emit("connect_tv", data)
            }
        },[state]
    )
    const join_channel = useCallback(
        () => {
            if(state){
                let data = {
                    room: state.exam.exam.code_examen,
                }
                // console.log(room.split(","))
                socket.emit("composition", data)
            }
        },[state]
    )

    useEffect(() => {
        join_room1()
    },[join_room1])

    useEffect(() => {
        if(isSujetSuccess){
            let data = {
                room: state.exam.exam.code_examen,
                statut: true,
                sujets: sujets.questions,
                sujet: sujets.sujet,
                exam: state.exam.exam
            }
            socket.emit("start_composition", data)
        }
    },[state, isSujetSuccess,sujets])

    useEffect(() => {
        join_channel()
    },[join_channel])

    useEffect(() => {
        if(!state){
            navigate(links.home)
        }else{
            dispatch(getSujets({
                examen_code: state.exam.exam.code_examen
            }))
        }
        dispatch(getMe())
        return () => {
            dispatch(reset())
        }
    },[dispatch, state, navigate])


    if(isLoading || isSujetLoading){
        return (
            <div className='sigepec-big-load'>
                <div className='load'></div>
            </div>
        )
    }
    if(isError || isSujetError){
        return (
            <EmptySection Illustration={SadIllustration}>
                {message || examState.message}
            </EmptySection>
        )
    }
    return (
        <MainLayout title={"Demarrer la composition"} admin={me}>
           
            <div className='sigepec-page'>
                {isSujetSuccess && sujets && sujets.questions !== "Pas de question" ?  
                    (<RenewQuestion list={state.list} exam={state} socket={socket} questIndex={question} fncQuesion={setQuestion} sujet={sujets} examen={state.exam.exam.code_examen} langue={state.exam.exam.details.langue}/> )
                    : (
                    <EmptySection Illustration={SadIllustration}>
                    {"Oupss!!! Il y a pas de sujets"}
                    </EmptySection>
                )}
            </div>
        </MainLayout>
    );
};

export default Composition;