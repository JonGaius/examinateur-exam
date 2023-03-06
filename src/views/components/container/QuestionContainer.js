import React, { useCallback, useEffect, useRef, useState } from 'react';
import {useNavigate} from "react-router-dom";
import { toArray } from '../../../utils/sharedFunction';
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"
import { links } from '../../../router/constant';

import audioIntroFr from "../../../assets/audio/introduction/introduction_francais.mp3"
import audioIntroDi from "../../../assets/audio/introduction/introduction_dioula.mp3"
import audioIntroMo from "../../../assets/audio/introduction/introduction_moore.mp3"
import audioIntroFu from "../../../assets/audio/introduction/introduction_fulfulde.mp3"

const finished = JSON.parse(localStorage.getItem('finish-exam'));

const QuestionContainer = ({exam, questIndex, fncQuesion, sujet, socket,examen, langue, list}) => {

    const [time, setTime] = useState(0)
    const [timeI, setTimeI] = useState(0)
    const [tabsList, setTabsList] = useState([])
    const [affiche, setAffiche] = useState(false)
    
    const [start, setStart] = useState(false)
    const [repeat, setRepeat] = useState(true)
    const [musicPath, setMusiPath] = useState("")
    const [musicIPath, setMusicIPath] = useState("")
    const [secondLeft, setSecondLeft] = useState(0)
    const secondLeftRef = useRef(secondLeft)
    const green = "#EF233C"

    let navigate = useNavigate()

    const choiceAudio = useCallback(
        () => {
            switch (langue) {
                case "français":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_fr)
                    setMusicIPath(audioIntroFr)
                    break;

                case "mooré":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_moore)
                    setMusicIPath(audioIntroMo)
                    break;

                case "dioula":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_dioula)
                    setMusicIPath(audioIntroDi)
                    break;
        
                case "fulfuldé":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_fulfulde)
                    setMusicIPath(audioIntroFu)
                    break;
                        
                default:
                    setMusiPath("")
                    setMusicIPath(audioIntroFr)
                    break;
            }
        },[langue, sujet, questIndex]
    )

    const cloreExam = () => {

        let data = {
            room: examen,
            statut: true,
        }
        socket.emit("finish_composition", data)

        setAffiche(true)
        localStorage.setItem('finish-exam', JSON.stringify(true))
        
    }
    
    const showResult = () => {
        localStorage.removeItem('finish-exam')
        navigate(links.examCompositionFinish, {
            state: exam
        })
    }
    
    useEffect(() => {
        choiceAudio()
    },[choiceAudio])

    const timerQuestion = useCallback(
        () => {
            if(musicPath){
                const music = new Audio(musicPath);
                music.onloadedmetadata = (e) => {
                    if (music.readyState > 0) {
                        // console.log(e)
                        var minutes = parseInt(music.duration / 60, 10);
                        var seconds = parseInt(music.duration % 60);
            
                        if(minutes > 0){
                            setTime(minutes * 60 + seconds)
                        }else{
                            setTime(seconds)
                        }
                    }
                }
            }
        }, [musicPath]
    )

    const timerIntro = useCallback(
        () => {
            if(musicIPath){
                const music = new Audio(musicIPath);
                music.onloadedmetadata = (e) => {
                    if (music.readyState > 0) {
                        // console.log(e)
                        var minutes = parseInt(music.duration / 60, 10);
                        var seconds = parseInt(music.duration % 60);
            
                        if(minutes > 0){
                            setTimeI(minutes * 60 + seconds)
                        }else{
                            setTimeI(seconds)
                        }
                    }
                }
            }
        }, [musicIPath]
    )

    useEffect(() => {
        timerIntro()
        timerQuestion()
    }, [timerIntro, timerQuestion])

    useEffect(() => {
        if(start){

            secondLeftRef.current = (time * 2) + 15
            setSecondLeft(secondLeftRef.current)
            const timer = setInterval(() => {
                if(secondLeftRef.current === time - 2){
                    setRepeat(true)
                }
                if(secondLeftRef.current === 0){
                //    navigate("/examens/fin")
                    if(questIndex < sujet.questions.length - 1){
                        let id = questIndex + 1
                        fncQuesion(questIndex + 1)
                        let data = {
                            room: examen,
                            questionIndex: id,
                        }
                        socket.emit("question_suivant", data)
                        if(document.querySelector(".sigepec-examinateur-composition__image--big")){
                            document.querySelector(".sigepec-examinateur-composition__image--big").classList.remove("is--show")
                        }
                    }else{
    
                        let datas = {
                            room: examen,
                            statut: true,
                        }
                        socket.emit("finish_composition", datas)
                        setAffiche(true)
                        localStorage.setItem('finish-exam', JSON.stringify(true))
                    }
                }
                if(secondLeftRef.current > 0){
                    secondLeftRef.current = secondLeftRef.current - 1;
                    setSecondLeft(secondLeftRef.current)
    
                    let data = {
                        room: examen,
                        time: time,
                        secondLeft: secondLeftRef.current
                    }
                    socket.emit("timer", data)
                }
            }, 1000)
            return () => clearInterval(timer)
        }else{
            secondLeftRef.current = timeI + 5
            setSecondLeft(secondLeftRef.current)
            const timer = setInterval(() => {
                if(secondLeftRef.current === 0){

                    setStart(true)
                    let data = {
                        room: examen,
                        start: true,
                    }
                    socket.emit("start_examen_composition", data)
                }

                if(secondLeftRef.current > 0){
                    secondLeftRef.current = secondLeftRef.current - 1;
                    setSecondLeft(secondLeftRef.current)
                }
            }, 1000)

            return () => clearInterval(timer)
        }

    },[fncQuesion,socket, questIndex,examen,  time, sujet , start, timeI])

    useEffect(() => {
        if(start){
            const music = new Audio(musicPath);
            if(repeat){
                music.play();
                setRepeat(!repeat)
            }
        }else{
            const music = new Audio(musicIPath);
            music.play();
        }
    },[musicPath, start, musicIPath,repeat])

    useEffect(() => {
        socket.on("get_candidat_reponses", (data) => {
            if(data.candidat_id ){
                if(list
                    .filter(el => el.presence === true)
                    .filter(el => el.candidat_numero === data.candidat_id).length > 0){ 

                    if(tabsList.filter(el => el !== data.candidat_id)){
                        setTabsList((list) => [data.candidat_id, ...list])
                    }else{
                        return
                    }
                    
                }else{
                    return
                }
            }
        })

    },[socket, list, tabsList])

    return (
        <>
        {
            start ? (

                !affiche && !finished ? (
                    <div className='sigepec-examinateur-composition'>
                        <div className='sigepec-examinateur-composition__image'>
                            <img className='main' src={"https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].image_question} alt="question" />
                            {/* <button type='button' onClick={() => {
                                document.querySelector(".sigepec-examinateur-composition__image--big").classList.add("is--show")
                            }}>
                                Afficher en grand
                            </button>
                            <div className='sigepec-examinateur-composition__image--big' onClick={() => {
                                document.querySelector(".sigepec-examinateur-composition__image--big").classList.remove("is--show")
                            }}>
                                <img src={"https://sigepec.hisiastudio.com/" + sujet.questions[questIndex].image_question} alt="question" />
                            </div> */}
                        </div>
                        <div className='sigepec-examinateur-composition__container'>
                            <div className='sigepec-examinateur-composition__intitule sigepec-examinateur-composition-intitule'>
                                <div className='sigepec-examinateur-composition-intitule__timer'>
                                
                                    <CircularProgressbar value={secondLeft / ((time * 2) + 15) * 100} text={`${Math.floor(secondLeft / 60)} : ${(secondLeft % 60) < 10 ? "0"+secondLeft % 60 : secondLeft % 60}`} styles={buildStyles({
                                        pathColor: green,
                                        textColor: green,
                                        textSize: 19
                                    })} />
            
                                    {/* {console.log(secondLeft / (time + 30))} */}
                                    <strong>Question {questIndex + 1} sur {sujet.questions.length}</strong>
                                </div>
                                <h2>{sujet.questions[questIndex].intitule_question}</h2>
                                <div className='sigepec-examinateur-composition-intitule__responses'>
                                    {
                                        sujet.questions[questIndex].reponses.map((reponse, index) => (
                                            <div className='sigepec-examinateur-composition-intitule__response' key={index}>
                                                <p>{reponse.intitule_reponse}</p>
                                                <div className='sigepec-examinateur-composition-intitule__response--item'>
                                                    {
                                                        toArray(reponse.reponse_possible).map((resp, index) => (
                                                            <strong key={index}>{resp}</strong>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='sigepec-h-bar'></div>
                                <button type='button' className='sigepec-button sigepec-button--secondary' onClick={() => {
                                    cloreExam()
                                }}>
                                    Clore l'examen
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
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
                )
            ) : (
                <div className='sigepec-big-timer'>
                    <CircularProgressbar value={secondLeft / (timeI  + 5) * 100} text={`${Math.floor(secondLeft / 60)} : ${(secondLeft % 60) < 10 ? "0"+secondLeft % 60 : secondLeft % 60}`} styles={buildStyles({
                        pathColor: green,
                        textColor: "#000",
                        textSize: 19
                    })} />
                    <h2>Examen</h2>
                    <p>L'examen commencera à la fin des instructions</p>           
                </div>
            )

        }
        </>
    );
};

export default QuestionContainer;