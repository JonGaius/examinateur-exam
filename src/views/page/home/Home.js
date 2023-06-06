import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import ExamIcon from '../../../assets/icons/service/ExamIcon';
import QuestionIcon from '../../../assets/icons/service/QuestionIcon';
import StartIcon from '../../../assets/icons/ui/StartIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { getTodayExams, reset as examReset } from '../../../features/examens/examenSlice';
import { links } from '../../../router/constant';
import ModuleItem from '../../components/card/ModuleItem';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';
import {capitalize} from "../../../utils/sharedFunction";

const Home = () => {

    const dispatch = useDispatch()
    let navigate = useNavigate()
    const {me, examinateur} = useSelector(
        (state) => state.auth
    )
    const userAuth = useSelector(
        (state) => state.auth
    )
    const {examens, isLoading, isSuccess, isError, message} = useSelector(
        (state) => state.examen
    )
    const modules = [
        {
            name: "Programmation",
            link: links.examens,
            Icon: ExamIcon
        },
        {
            name: "Etats",
            link: links.etats,
            Icon: QuestionIcon
        },
    ]

    useEffect(() => {
        dispatch(getMe())
        dispatch(getTodayExams({
            examinateur_id: examinateur
        }))
        return () => {
            dispatch(reset())
            dispatch(examReset())
            window.location.reload()
        }
    },[dispatch, examinateur])

    if(userAuth.isLoading || isLoading){
        return (
            <div className='sigepec-big-load'>
                <div className='load'></div>
            </div>
        )
    }
    if(userAuth.isError){
        return (
            
            <EmptySection Illustration={SadIllustration}>
                {userAuth.message}
            </EmptySection>
        )
    }
    
    return (
        <MainLayout title={"Accueil"} admin={me}>
            {
               userAuth.isSuccess && me && (
                    <div className='sigepec-page'>
                        <div className='sigepec-page-header'>
                            <h1>🖐🏽</h1>
                            <h2>Bonjour {me.prenom + " " + me.nom}</h2>
                            <span>Que souhaitez-vous faire ?</span>
                        </div>
                        <div className='sigepec-page-content'>
                        {
                            isSuccess && examens && examens.examens_du_jour && examens.examens_du_jour.filter(el => el.statut_examen === "cloturer").length > 0 ? (
                                <div className='sigepec-page-content__start sigepec-page-content-start'>
                                    <button to={links.examIntro} type="button" className='sigepec-page-content-start__container' onClick={() => {
                                        navigate(links.examIntro, {
                                            state: examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0]
                                        })
                                    }}>
                                        <div className='sigepec-page-content-start__icon'>
                                            <StartIcon/>
                                        </div>
                                        <div className='sigepec-page-content-start__text'>
                                            <span>Examen: {examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].code_examen} </span> <br />
                                            <strong>Commencer l'examen</strong>
                                            <p>
                                                <span>{examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0] && examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].details && capitalize(examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].details.langue)}</span> - <span>{examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0] && examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].details && capitalize(examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].details.mode)}</span> - <span>{examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0] && examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].details && capitalize(examens.examens_du_jour.filter(el => el.statut_examen === "cloturer")[0].details.salle.nom_salle_code)}</span>
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                
                                isError ? (
                                  <strong>{message} <br /></strong>  
                                ) : <strong>Aucun examen vous concernant n'a été programmé</strong> 
                            )
                        }
                        
                        </div>
                        <div className='sigepec-module-list'>
                            {
                                modules.map(({name,link, Icon }, index) => (
                                    <div className='sigepec-module-list__item' key={index}>
                                        <ModuleItem link={link} Icon={Icon} >
                                            {name}
                                        </ModuleItem>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </MainLayout>
    );
};

export default Home;
