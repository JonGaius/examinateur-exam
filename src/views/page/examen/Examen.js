import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NextIcon from '../../../assets/icons/ui/NextIcon';
import BackIcon from '../../../assets/icons/ui/BackIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { getMyPrograms } from '../../../features/examens/examenSlice';
import { links } from '../../../router/constant';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';
import EmptyIllu from '../../../assets/illustrations/EmptyIllu';
import EyeIcon from '../../../assets/icons/ui/EyeIcon';
import CancelIcon from '../../../assets/icons/ui/CancelIcon';

const Examen = () => {

    const limit = 10

    const [examen, setExamen] = useState("");
    const [page, setPage] = useState(1)
    const [debut, setDebut] = useState(0)
    const [fin, setFin] = useState(limit)

    const dispatch = useDispatch()
    const {me, examinateur} = useSelector(
        (state) => state.auth
    )
    const userAuth = useSelector(
        (state) => state.auth
    )

    const {examens, isLoading, isSuccess, isError, message} = useSelector(
        (state) => state.examen
    )

    const nextPage = () => {
        setDebut(debut + limit)
        setFin(fin + limit)
        setPage(page + 1)
    }
    const prevPage = () => {
        setPage(page - 1)
        setDebut(debut - limit)
        setFin(fin - limit)
    }
    
    const removeModal = (id) => {
        document.getElementById(id).classList.remove("is--show");
    }
    const showModal = (id, exam) => {
        setExamen(exam)
        document.getElementById(id).classList.add("is--show");
    }

    useEffect(() => {
        dispatch(getMe())
        dispatch(getMyPrograms({
            examinateur_id: examinateur
        }))
        return () => {
            dispatch(reset())
            // dispatch(examReset())
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
        <MainLayout title={"Les examens"} admin={me}>
        {
           userAuth.isSuccess && me && (
                <div className='sigepec-page'>
                    <div className='sigepec-page__container2'>
                        <div className='sigepec-filedarianne'>
                            <Link to={links.home}>Accueil</Link> / <span> Liste des examen</span>
                        </div>

                        <div className='sigepec-page-header2'>
                            <div className='sigepec-page-title'>
                                {/* <h2>Programmation</h2> */}
                                <h1>Mon programme d'examen</h1>
                            </div>
                        </div>   
                        {
                            isLoading ? (
                                <div className={`sigepec-form-alert`}>
                                    <div className='sigepec-form-alert__container'>
                                        <div className='sigepec-form-alert__icon'>
                                            <div className='load'></div>
                                        </div>
                                        <div className='sigepec-form-alert__text'>
                                            <strong>{"Chargement des données en cours"}</strong>
                                            <p>{"Veuillez patienter un instant..."}</p>
                                        </div>
                                        
                                    </div>
                                </div>
                            ) : (
                                isError ? (
                                    <EmptySection Illustration={SadIllustration}>
                                        {message}
                                    </EmptySection>
                                ) : (
                                    isSuccess && (
                                        <div className='sigepec-page-tabContainer'>
                                            <div className='sigepec-page-tabContainer__header sigepec-page-tabContainer-header'>
                                                {
                                                    examens && (limit <= examens.length) && (
                                                        <>
                                                            <div className='sigepec-page-tabContainer-header__pagination'>
                                                                <button type='button' className={`sigepec-button-icon sigepec-button-icon--normal ${debut < 1 ? "is--disable" : "" }`} onClick={() => prevPage()}>
                                                                    <BackIcon/> <span>Précédent</span>
                                                                </button>
                                                                <button type='button' className={`sigepec-button-icon sigepec-button-icon--normal ${fin > examens.length - 1 ? "is--disable" : "" }`} onClick={() => nextPage()}>
                                                                    <NextIcon/> <span>Suivant</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>

                                            {
                                                examens && examens.length > 0 ? (
                                                    <div className='sigepec-page-tabContainer__body sigepec-page-tabContainer-body'>
                                                        <div className='sigepec-table'>
                                                            <div className='sigepec-table__header sigepec-table-header'>
                                                                <div className='sigepec-table__row sigepec-table-row'>
                                                                    <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xs'>
                                                                    <strong>#</strong>
                                                                    </div>
                                                                    <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm3'>
                                                                        <strong>Code examen</strong>
                                                                    </div>
                                                                    <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xl2'>
                                                                        <strong>Lieu et Salle</strong>
                                                                    </div>
                                                                    <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm'>
                                                                        <strong>Date et Heure</strong>
                                                                    </div>
                                                                    <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm is--action'>
                                                                        <strong>Statut</strong>
                                                                    </div>
                                                                    <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm is--action'>
                                                                        <strong>Actions</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='sigepec-table__body sigepec-table-body'>
                                                                {
                                                                    examens.map((exam, index) => (
                                                                        <div className='sigepec-table__row sigepec-table-row' key={index}>
                                                                            <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xs'>
                                                                                <strong>{index + 1}</strong>
                                                                            </div>
                                                                            <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm3'>
                                                                                <p>
                                                                                    
                                                                                    <span>{exam.code_examen}</span>  
                                                                                </p>
                                                                            </div>
                                                                            <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xl2'>
                                                                                <p>
                                                                                    <span>{exam.lieu}</span> <br />
                                                                                    <strong>{exam.details.salle.nom_salle_code}</strong>  
                                                                                </p>
                                                                            </div>
                                                                            <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm'>
                                                                                <p>
                                                                                    <strong>Date: {exam.date_examen}</strong> <br />
                                                                                    <span>Heure: {exam.heure_examen}</span>  
                                                                                </p>
                                                                            </div>
                                                                            <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm is--action'>
                                                                                {
                                                                                    exam.statut_examen.toLowerCase() === "cloturer" ? (
                                                                                        <span className='sigepec-chip sigepec-chip--info'>
                                                                                            Clôturer
                                                                                        </span>
                                                                                    ):(
                                                                                        exam.statut_examen.toLowerCase() === "annuler" ? (
                                                                                            <span className='sigepec-chip sigepec-chip--danger'>
                                                                                                Annuler
                                                                                            </span>
                                                                                        ): (
                                                                                            
                                                                                            exam.statut_examen.toLowerCase() === "terminer" ? (
                                                                                                <span className='sigepec-chip sigepec-chip--success'>
                                                                                                    Terminer
                                                                                                </span>
                                                                                            ) : (

                                                                                                <span className='sigepec-chip sigepec-chip--warning'>
                                                                                                    En attente
                                                                                                </span>
                                                                                            )
                                                                                            
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm is--action'>
                                                                                <button type='button' className='sigepec-button-icon sigepec-button-icon--normal' onClick={() => {
                                                                                    showModal("show-modal", exam)
                                                                                }}>
                                                                                    <EyeIcon/> <span>Editer</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <EmptySection Illustration={EmptyIllu}>
                                                        Aucun examen du code n'a été programmé
                                                    </EmptySection>
                                                )
                                            }
                                        </div>
                                    )
                                )
                            )
                        }     
                    </div>
                </div>
           )
        }

        <div className='sigepec-modal' id='show-modal'>
            <div className='sigepec-modal__container'>
                <button type='button' className='sigepec-modal__button' onClick={() => {
                    removeModal("show-modal")
                }}>
                    <CancelIcon/>
                </button>
                <div className='sigepec-modal__header'>
                    <h2>{`Information de l'examen `}</h2>
                </div>
                <div className='sigepec-modal__body'>
                    {
                        examen && (
                            <>
                                <div className='sigepec-modal-item'>
                                    <span>Code examen:</span> <strong>{examen.code_examen}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Date:</span> <strong>{examen.date_examen}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Heure:</span> <strong>{examen.heure_examen}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Lieu:</span> <strong>{examen.lieu}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Salle:</span> <strong>{examen.details.salle.nom_salle_code}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Mode:</span> <strong>{examen.details.mode}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Langue:</span> <strong>{examen.details.langue}</strong>
                                </div>
                                <div className='sigepec-modal-item'>
                                    <span>Catégorie:</span> <strong>{examen.categorie_permis}</strong>
                                </div>
                            </>
                        )
                    }
                    
                </div>
            </div>
        </div>
       
        </MainLayout>
    );
};

export default Examen;