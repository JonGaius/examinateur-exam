import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { links } from '../../../router/constant';
import { toArray } from '../../../utils/sharedFunction';

const finished = JSON.parse(localStorage.getItem('finish-exam'));

const RenewQuestion = ({exam, questIndex, fncQuesion, sujet, socket, examen, langue, list}) => {
    const [repeat, setRepeat] = useState(true)
    const [musicPath, setMusiPath] = useState("")
    const [tabsList, setTabsList] = useState([])
    const [affiche, setAffiche] = useState(false)

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
    
    let navigate = useNavigate()

    const choiceAudio = useCallback(
        () => {
            switch (langue) {
                case "français":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_fr)
                    break;
                case "mooré":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_moore)
                    break;

                case "dioula":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_dioula)
                    break;
        
                case "fulfuldé":
                    setMusiPath("https://sigepec.hisiastudio.com/"+sujet.questions[questIndex].audio_fulfulde)
                    break;
                        
                default:
                    setMusiPath("")
                    break;
            }
        },[langue, sujet, questIndex]
    )

    useEffect(() => {
        choiceAudio()
    }, [choiceAudio])


    const changeQuestion = () => {
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
    useEffect(() => {
        const music = new Audio(musicPath);
        if(repeat){
            music.play();
            setRepeat(!repeat)
        }
    },[musicPath,repeat])

    useEffect(() => {
        socket.on("get_candidat_reponses", (data) => {
            if(data.candidat_id ){
                if(list.filter(el => el.presence === true).filter(el => el.candidat_numero === data.candidat_id).length > 0){ 

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
                                <button type='button' className='sigepec-button' onClick={() => {
                                    setRepeat(true)
                                }}>
                                    Rejouer l'audio
                                </button>
                                <div className='sigepec-h-bar'></div>
                                <button type='button' className='sigepec-button sigepec-button--primary' onClick={() => {
                                    changeQuestion()
                                }}>
                                    {
                                        questIndex < sujet.questions.length - 1 ? (
                                            "Question suivante"
                                        ) : (
                                            "Terminer la composition"
                                        )
                                    }
                                </button>
                                
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
            }
        </>
    );
};

export default RenewQuestion;