import React, { useCallback, useEffect, useState } from 'react';
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
import io from "socket.io-client"
import { WEBSOCKETURL } from '../../../utils/constant';

import audioIntroFr from "../../../assets/audio/introduction/introduction_francais.mp3"
import audioIntroDi from "../../../assets/audio/introduction/introduction_dioula.mp3"
import audioIntroMo from "../../../assets/audio/introduction/introduction_moore.mp3"
import audioIntroFu from "../../../assets/audio/introduction/introduction_fulfulde.mp3"

const socket = io.connect(WEBSOCKETURL)

const Test = () => {
    const {state} = useLocation()
    let navigate = useNavigate()
    const dispatch = useDispatch()
    const [musicIPath, setMusicIPath] = useState("")
    const {me, isLoading, isError, message} = useSelector(
        (state) => state.auth
    )

    const choiceAudio = useCallback(
        () => {
            switch (state.exam.exam.details.langue) {
                case "français":
                    setMusicIPath(audioIntroFr)
                    break;

                case "fulfuldé":
                    setMusicIPath(audioIntroFu)
                    break;

                case "dioula":
                    setMusicIPath(audioIntroDi)
                    break;
                
                case "mooré":
                    setMusicIPath(audioIntroMo)
                    break;
                    
                default:
                    break;
            }
        },[state]
    )

    // console.log(state.exam.codeTV)
    const send_to_tv = useCallback(
        () => {
            if(state){
                let data = {
                    room: state.exam.codeTV,
                    etape: "composition"
                }
                // console.log(room.split(","))
                socket.emit("send_to_tv", data)
            }
        },[state]
    )

    useEffect(() => {
        choiceAudio()
    },[choiceAudio])

    useEffect(() => {
        send_to_tv()
    },[send_to_tv])

    useEffect(() => {
        if(!state){
            navigate(links.home)
        }
        dispatch(getMe())

        return () => {
            dispatch(reset())
        }
    },[dispatch, state, navigate])

    useEffect(() => {
        const music = new Audio(musicIPath);
        music.play();
    },[musicIPath])

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
                                <p>Code de l'examen:</p>
                                <h2>{state.exam.exam.code_examen}</h2>
                                <p>
                                    <span>{state.exam.exam.details.langue}</span> - <span>{state.exam.exam.details.mode}</span> - <span>{state.exam.exam.details.salle.nom_salle_code}</span>
                                </p>
                                <br />
                                <span>Démarrer la composition l'examen</span>

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
                                <span>Présent(s)</span>
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
                                <span>Absent(s)</span>
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