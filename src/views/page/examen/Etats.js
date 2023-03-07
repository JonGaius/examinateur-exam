import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import BackIcon from '../../../assets/icons/ui/BackIcon';
import CancelIcon from '../../../assets/icons/ui/CancelIcon';
import EyeIcon from '../../../assets/icons/ui/EyeIcon';
// import NextIcon from '../../../assets/icons/ui/NextIcon';
import EmptyIllu from '../../../assets/illustrations/EmptyIllu';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { getExams, reset as examReset } from '../../../features/examens/examenSlice';
import { links } from '../../../router/constant';
import FormButton from '../../components/button/FormButton';
import EmptySection from '../../components/container/EmptySection';
import Textfield from '../../components/textfield/Textfield';
import MainLayout from '../../layout/MainLayout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BackIcon from '../../../assets/icons/ui/BackIcon';
import NextIcon from '../../../assets/icons/ui/NextIcon';
import image from "../../../assets/images/logos.png"
import {capitalize, modeExamen} from "../../../utils/sharedFunction";

const Etats = () => {

    const limit = 10

    const [examen, setExamen] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");

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
    
    const getMyEtats = (e) => {
        e.preventDefault()
        const data = {
            examinateur_id: examinateur,
            date_de_debut: dateDebut,
            date_de_fin: dateFin
        }
        dispatch(getExams(data))
    }

    const generatePDF = () => {
        if(document.querySelector("#resultat")){
            document.querySelector("#resultat").classList.add("is--show")
        }
        html2canvas(document.querySelector("#file-resultat")).then(canvas => {
            document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('portrait','pt','a4');
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save(`etat-du-${dateDebut}-au-${dateFin}-page-${page}.pdf`); 
        });        
    }

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
       
        return () => {
            dispatch(reset())
            dispatch(examReset())
        }
    },[dispatch, examinateur])

    if(userAuth.isLoading){
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
        <MainLayout title={"Mes Etats"} admin={me}>
            {
                userAuth.isSuccess && me && (
                    <div className='sigepec-page' id='invoice'>
                        <div className='sigepec-page__container2'>
                            <div className='sigepec-filedarianne'>
                                <Link to={links.home}>Accueil</Link> / <span> Mes états</span>
                            </div>

                            <div className='sigepec-page-header2'>
                                <div className='sigepec-page-title'>
                                    {/* <h2>Programmation</h2> */}
                                    <h1>Mes états</h1>
                                </div>
                                <div className='sigepec-page-header2__actions'>
                                    {
                                        isSuccess && examens && examens.length > 0 ? (
                                            <div className='sigepec-page-header2__action'>
                                                <button type='button' className='sigepec-button sigepec-button--secondary' onClick={() => generatePDF()}>
                                                    <span>Exporter en pdf</span>
                                                </button>
                                            </div>

                                        ) : (
                                            <div className='sigepec-page-header2__action'>
                                                <button type='button' className='sigepec-button sigepec-button--disable'>
                                                    <span>Exporter en pdf</span>
                                                </button>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                            </div>  
                            <div className='sigepec-page-formulaire'>
                                <form className='sigepec-page-formulaire__form' onSubmit={getMyEtats}>
                                        <Textfield id={"debut"} type={"date"} dvalue={dateDebut} fnc={setDateDebut} placeholder={"Entrer la date de début"}>
                                            Date de début
                                        </Textfield>
                                        <Textfield id={"fin"} type={"date"} dvalue={dateFin} fnc={setDateFin} placeholder={"Entrer la date de fin"}>
                                            Date de fin
                                        </Textfield>
                                    
                                    <div className='sigepec-page-formulaire__action'>
                                        <FormButton type={"submit"} mStyle={"primary"}>
                                            Chercher
                                        </FormButton>
                                    </div>
                                </form>
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
                                                    [...examens] && [...examens].length > 0 ? (
                                                        <div className='sigepec-page-tabContainer__body sigepec-page-tabContainer-body'>
                                                            {
                                                            parseInt(examens
                                                                .length / limit) > 0 ? (
                                                                <strong>
                                                                    {
                                                                        examens
                                                                        .length % limit > 0 ? (
                                                                            `Page ${page} sur ${parseInt(examens
                                                                                .length / limit) + 1}`
                                                                        ) : (
                                                                            `Page ${page} sur ${parseInt(examens
                                                                                .length / limit)}`
                                                                        )
                                                                    }
                                                                    
                                                                </strong>
                                                            ) : (
                                                                <strong>Page {page} sur {parseInt(examens
                                                                    .length / limit) + 1}</strong>
                                                            )
                                                        }
                                                        <br />
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
                                                                            <strong>Nombre de candidats</strong>
                                                                        </div>
                                                                        <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm is--action'>
                                                                            <strong>Actions</strong>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className='sigepec-table__body sigepec-table-body'>
                                                                    {
                                                                        examens
                                                                        .slice(debut, fin)
                                                                        .map((exam, index) => (
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
                                                                                        <strong>{exam.details && exam.details.salle.nom_salle_code}</strong>
                                                                                    </p>
                                                                                </div>
                                                                                <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm'>
                                                                                    <p>
                                                                                        <strong>Date: {exam.date_examen}</strong> <br />
                                                                                        <span>Heure: {exam.heure_examen}</span>  
                                                                                    </p>
                                                                                </div>
                                                                                <div className='sigepec-table__column sigepec-table-column sigepec-table-column--xm is--action'>
                                                                                    <strong>{exam.nombre_de_candidat}</strong>
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
                                                            Aucun examen
                                                        </EmptySection>
                                                    )
                                                }

                                                <div className='sigepec-export-modal' id='resultat'>
                                                    <div className='sigepec-export-modal__container'>
                                                        <div className='sigepec-export-modal__close'>
                                                            <button type="button" onClick={() => {
                                                                document.querySelector("#resultat").classList.remove("is--show")
                                                                document.querySelector("canvas").style.display = "none"
                                                            }}>
                                                                <CancelIcon/>
                                                            </button>
                                                        </div>
                                                        <div className='sigepec-export-modal__contain sigepec-export-file sigepec-export-file--a4' id='file-resultat'>
                                                            <div className='sigepec-export-file__container'>
                                                                <div className='sigepec-export-file__head'>
                                                                    <div className='sigepec-export-file__logo'>
                                                                        <img src={image} alt="sigepec" />
                                                                    </div>
                                                                    <div className='sigepec-export-file__head--text'>
                                                                        <div style={{
                                                                            width: "100%",
                                                                        }}>
                                                                            <p><span>Examinateur:  </span><strong>{me.nom + " " + me.prenom}</strong></p>
                                                                        </div>
                                                                        <div>
                                                                            <p><span>Date de début:  </span><strong>{dateDebut}</strong></p>
                                                                        </div>
                                                                        <div>
                                                                            <p><span>Date de fin:  </span><strong>{dateFin}</strong></p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='sigepec-export-file-title'>
                                                                    <h1>Etats</h1>
                                                                </div>
                                                                <div className='sigepec-export-file__tabs sigepec-export-file-tabs'>
                                                                    {
                                                                        [...examens] && [...examens].length > 0 ? (
                                                                            <div className='sigepec-export-file__tabs sigepec-export-file-tabs'>
                                                                                {parseInt(examens.length / limit) > 0 ? (
                                                                                        <strong>
                                                                                            {
                                                                                                examens
                                                                                                .length % limit > 0 ? (
                                                                                                    `Page ${page} sur ${parseInt(examens
                                                                                                        .length / limit) + 1}`
                                                                                                ) : (
                                                                                                    `Page ${page} sur ${parseInt(examens
                                                                                                        .length / limit)}`
                                                                                                )
                                                                                            }
                                                                                            
                                                                                        </strong>
                                                                                    ) : (
                                                                                        <strong>Page {page} sur {parseInt(examens.length / limit) + 1}</strong>
                                                                                    )
                                                                                }
                                                 
                                                                                <div className='sigepec-export-file-tabs__head'>
                                                                                    <div className='sigepec-export-file-tabs__row'>
                                                                                        <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--lil'>
                                                                                            <strong>#</strong>
                                                                                        </div>
                                                                                        <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                            <strong>Code examen</strong>
                                                                                        </div>
                                                                                        <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                            <strong>Lieu et Salle</strong>
                                                                                        </div>
                                                                                        <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                            <strong>Date et Heure</strong>
                                                                                        </div>
                                                                                        <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                            <strong>Nombre de candidat</strong>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='sigepec-export-file-tabs__body'>
                                                                                    {
                                                                                        [...examens]
                                                                                        .slice(debut, fin)
                                                                                        .map((exam, index) => (
                                                                                            <div className='sigepec-export-file-tabs__row' key={index}>
                                                                                                <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--lil'>
                                                                                                    <strong>{index + 1}</strong>
                                                                                                </div>
                                                                                                <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                                    <span>{exam.code_examen}</span>
                                                                                                </div>
                                                                                                <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                                    <p>
                                                                                                        <span>{exam.lieu}</span> <br />
                                                                                                        <strong>{exam.details && exam.details.salle && exam.details.salle.nom_salle_code}</strong>
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                                    <p>
                                                                                                        <strong>Date: {exam.date_examen}</strong> <br />
                                                                                                        <span>Heure: {exam.heure_examen}</span>  
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className='sigepec-export-file-tabs__col sigepec-export-file-tabs__col--mid'>
                                                                                                    <strong>{exam.nombre_de_candidat}</strong>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <EmptySection Illustration={EmptyIllu}>
                                                                                Aucun examen
                                                                            </EmptySection>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
                                    {
                                        examen.statut_examen.toLowerCase() === "cloturer" ? (
                                            <span className='sigepec-chip sigepec-chip--info'>
                                                Clôturer
                                            </span>
                                        ):(
                                            examen.statut_examen.toLowerCase() === "annuler" ? (
                                                <span className='sigepec-chip sigepec-chip--danger'>
                                                    Annuler
                                                </span>
                                            ): (
                                                
                                                examen.statut_examen.toLowerCase() === "terminer" ? (
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
                                    <div className='sigepec-modal-item'>
                                        <span>Code examen:</span> <strong>{examen.code_examen}</strong>
                                    </div>
                                    <div className='sigepec-modal-item'>
                                        <span>Nombre de candidats:</span> <strong>{examen.nombre_de_candidat}</strong>
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
                                        <span>Salle:</span> <strong>{examen.details && examen.details.salle && examen.details.salle.nom_salle_code}</strong>
                                    </div>
                                    <div className='sigepec-modal-item'>
                                        <span>Mode:</span> <strong>{examen.details && modeExamen(examen.details.mode)}</strong>
                                    </div>
                                    <div className='sigepec-modal-item'>
                                        <span>Langue:</span> <strong>{examen.details && capitalize(examen.details.langue)}</strong>
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

export default Etats;
