import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useLocation, useNavigate} from "react-router-dom"
import DangerIcon from '../../../assets/icons/ui/DangerIcon';
import UserIcon from '../../../assets/icons/ui/UserIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { getExam, reset as examReset, updateExam } from '../../../features/examens/examenSlice';
import { links } from '../../../router/constant';
import NoticeForm from '../../components/card/NoticeForm';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';

const Finish = () => {
    const {state} =  useLocation()

    let navigate = useNavigate()
    const dispatch = useDispatch()

    const {me} = useSelector(
        (state) => state.auth
    )
    const userAuth = useSelector(
        (state) => state.auth
    )
    const {examen, isLoading, isEditLoading, isSuccess, isEditSuccess, isError, isEditError, message} = useSelector(
        (state) => state.examen
    )
    const closeExamen = () => {
        const data = {
            id: state.exam.exam.id,
            statut_examen: "terminer"
        }
        dispatch(updateExam(data))
    }
    useEffect(() => {
        if(!state){
            navigate(links.home)
        }
        dispatch(getMe())
        dispatch(getExam(state.exam.exam.id))
        if(isEditSuccess){
            navigate(links.home, {
                state: {
                    statut: "success",
                    message: "L'examen est terminé"
                }
            })
        }
        return () => {
            dispatch(reset())
            dispatch(examReset())
        }

    },[state, navigate, dispatch, isEditSuccess])

    if(userAuth.isLoading || isLoading || isEditLoading){
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
        <MainLayout title={"Résultat de l'examen"} admin={me}>
            <div className='sigepec-page'>
                <div className='sigepec-page-header'>
                    <h1>📖</h1>
                    <h2>Résultat de l'examen</h2>
                    <p>Code de l'examen: <strong>{state.exam.exam.code_examen}</strong></p>
                </div>
                <div className='sigepec-page-content'>
                    <div className="sigepec-page-form">
                        <div className='sigepec-page-form__actions special'>
                            <div className='sigepec-page-form__action'>
                                <button type={"button"} className={`sigepec-button sigepec-button--primary`} onClick={() => closeExamen()}>
                                    {"Retour vers l'accueil"} 
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='sigepec-page-form__table sigepec-page-form-table'>
                        <strong>Liste des candidats</strong>
                        <div className='sigepec-h-bar'></div>
                        {
                            isEditError && (
                                <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                                    {message}
                                </NoticeForm>
                            )
                        }
                        {
                            isError ? (
                                <EmptySection Illustration={SadIllustration}>
                                    {message}
                                </EmptySection>
                            ) : (
                                isSuccess && examen && examen.candidatexamen_set && examen.candidatexamen_set.length > 0 ? (
                                    examen.candidatexamen_set.map((candidat, index) => (
                                        <div className='sigepec-page-form-table__row' key={index}>
                                            <div className='sigepec-page-form-table__col col-1'>
                                                <strong>{candidat.programmation_candidat.candidat.id}</strong>
                                            </div>
                                            <div className='sigepec-page-form-table__col col-auto'>
                                                <div className='sigepec-page-form-table__item'>
                                                    <div className='sigepec-page-form-table__avatar'>
                                                        {
                                                            candidat.programmation_candidat.candidat.dossier.fichiers.filter(el => el.type_de_fichier === "photo-identite")[0] ? (
                                                                <img src={"https://sigepec.hisiastudio.com/"+candidat.programmation_candidat.candidat.dossier.fichiers.filter(el => el.type_de_fichier === "photo-identite")[0].url_fichier} alt="avatar" />
                                                            ) : (
                                                                <UserIcon/>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='sigepec-page-form-table__info'>
                                                        <span>{candidat.programmation_candidat.candidat.dossier.numero_dossier} </span><br />
                                                        <strong>{candidat.programmation_candidat.candidat.dossier.info_id.nom} {candidat.programmation_candidat.candidat.dossier.info_id.nom_de_jeune_fille ? ` née ${candidat.programmation_candidat.candidat.dossier.info_id.nom_de_jeune_fille}` : ""} {" "+candidat.programmation_candidat.candidat.dossier.info_id.prenom}</strong> <br />
                                                        <span>Auto Ecole: {candidat.programmation_candidat.candidat.dossier.auto_ecole.nom_autoecole}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='sigepec-page-form-table__col col-mid'>
                                                {
                                                    candidat.score < 25 ? (
                                                        <span className='sigepec-chip sigepec-chip--danger'>
                                                            Ajourné
                                                        </span>

                                                    ) : (
                                                        <span className='sigepec-chip sigepec-chip--success'>
                                                            Admin
                                                        </span>

                                                    )
                                                }
                                                    
                                            </div>
                                            <div className='sigepec-page-form-table__col col-actions'>
                                                <strong>{candidat.score} / 30</strong>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <strong>Aucun candidat programmé</strong>
                                ) 
                            )
                        }
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Finish;