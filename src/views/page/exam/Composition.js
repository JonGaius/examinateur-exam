import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { getSujets } from '../../../features/examens/examenSlice';
import { links } from '../../../router/constant';
import Timer from '../../components/card/Timer';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';
import io from "socket.io-client"
import { WEBSOCKETURL } from '../../../utils/constant';
import { toArray } from '../../../utils/sharedFunction';

const socket = io.connect(WEBSOCKETURL)
const finished = JSON.parse(localStorage.getItem('finish-exam'));

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
    const [affiche, setAffiche] = useState(false)
    const [question, setQuestion] = useState(0)

    const changeQuestion = () => {
        if(sujets && sujets.sujet){
            if(question > sujets.sujet.questions_choisies.length){
                setQuestion(question + 1)
            }else{
                let data = {
                    room: state.exam.exam.code_examen,
                    statut: true,
                }
                socket.emit("finish_composition", data)
                navigate(links.examCompositionFinish)
            }
        }
    }

    const cloreExam = () => {

        let data = {
            room: state.exam.exam.code_examen,
            statut: true,
        }
        socket.emit("finish_composition", data)

        setAffiche(true)
        localStorage.setItem('finish-exam', JSON.stringify(true))
    }
    
    const showResult = () => {
        localStorage.removeItem('finish-exam')
    }
    
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
                {
                    finished || affiche ? (
                        <div className='sigepec-big-timer'>
                                <h2>Examen Terminé</h2>
                               
                                
                                <div className='sigepec-big-timer__btn' >
                                    <button type='button' className='sigepec-button sigepec-button--primary' onClick={() => {
                                        showResult()
                                    }}>
                                        Voir les résultats
                                    </button>
                                </div>
                                    
                            </div>
                    ) : (
                        (state && (state.exam.exam.details.mode === "tablette" || state.exam.exam.details.mode === "ordinateur")) ? (
                            <div className='sigepec-big-timer'>
                                <h2>Temps restant</h2>
                                <Timer fnc={setAffiche} socket={socket} examen={state.exam.exam.code_examen}/>
                                
                                <div className='sigepec-big-timer__btn' >
                                    <button type='button' className='sigepec-button sigepec-button--primary' onClick={() => {
                                        cloreExam()
                                    }}>
                                        Clôre l'examen
                                    </button>
                                </div>
                                    
                            </div>
                        ) : (
                            isSujetSuccess && sujets && sujets.questions && (
    
                                <div className='sigepec-page__container2'>
                                    <div className='sigepec-page-header2'>
                                        <div className='sigepec-page-title'>
                                            <strong>Question {question + 1} / {sujets.question.length}</strong>
                                        </div>
                                        <div className='sigepec-page-header2__actions'>
                                            <div className='sigepec-page-header2__action'>
                                                <button className='sigepec-button sigepec-button--primary' type='button' onClick={() => {
                                                    changeQuestion()
                                                }}>Suivant</button>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        sujets.questions.length > 0 && (
                                            <div className='sigepec-page-composition'>
                                                <div className='sigepec-page-composition__image'>
                                                    {
                                                        sujets.questions[question].image_question && (
                                                            <img src={sujets.questions[question].image_question} alt="sujet" />
                                                        )
                                                    }
                                                    <button type='button' onClick={() => {
                                                        if(document.querySelector(".sigepec-page-composition__image--big")){
                                                            document.querySelector(".sigepec-page-composition__image--big").classList.add("is-show")
                                                        }
                                                    }}>
                                                        Afficher l'image
                                                    </button>
                                                    {
                                                        sujets.questions[question].image_question && (
                                                            <div className='sigepec-page-composition__image--big' onClick={() => {
                                                                if(document.querySelector(".sigepec-page-composition__image--big")){
                                                                    document.querySelector(".sigepec-page-composition__image--big").classList.remove("is-show")
                                                                }
                                                            }}>
                                                                <img src={sujets.questions[question].image_question} alt="sujet" />
                                                            </div>
                                                        )
                                                    }
                                                    
                                                </div>
                                                <div className='sigepec-page-composition__text'>
    
                                                    <h2>{sujets.questions[question] && sujets.questions[question].intitule_question}</h2>
                                                    
                                                    {
                                                        sujets.questions[question] && sujets.questions[question].reponses.map((reponse, index) => (
                                                            <div className='sigepec-page-composition__text--level2' key={index}>
                                                                <strong>{reponse.intitule_reponse}</strong> <br />
                                                                <div className='sigepec-page-composition__text--level2__reponses'>
                                                                    {
                                                                        toArray(reponse.reponse_possible).map((resp, index) => (
                                                                            <span key={index}>{resp}</span>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        )
                    ) 
                }
            </div>
        </MainLayout>
    );
};

export default Composition;