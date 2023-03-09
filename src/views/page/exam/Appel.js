import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import CancelIcon from '../../../assets/icons/ui/CancelIcon';
import EyeIcon from '../../../assets/icons/ui/EyeIcon';
import UserIcon from '../../../assets/icons/ui/UserIcon';
import SadIllustration from '../../../assets/illustrations/SadIllustration';
import { getMe, reset } from '../../../features/auth/authSlice';
import { links } from '../../../router/constant';
import FormButton from '../../components/button/FormButton';
import EmptySection from '../../components/container/EmptySection';
import MainLayout from '../../layout/MainLayout';
import io from "socket.io-client"
import {URLIMAGE, WEBSOCKETURL} from '../../../utils/constant';
import NoticeForm from '../../components/card/NoticeForm';
import DangerIcon from '../../../assets/icons/ui/DangerIcon';

const socket = io.connect(WEBSOCKETURL)

const Appel = () => {

    const {state} = useLocation()
    const [user, setUser] = useState("")
    const [errors, setErrors] = useState("")
    const [list, setList] = useState([])
    let navigate = useNavigate()

    const dispatch = useDispatch()
    const {me, isLoading, isError, message} = useSelector(
        (state) => state.auth
    )
    const showModal = (id, candidat) => {
        setUser(candidat)
        document.getElementById(id).classList.add("is--show");
    }
   
    const join_room = useCallback(
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


    useEffect(() => {
        join_room()
    },[join_room])

    const send_to_tv = useCallback(
        () => {
            if(state){
                let data = {
                    room: state.codeTV,
                    etape: "appel",
                    resultat: state.exam
                }
                // console.log(room.split(","))
                socket.emit("send_to_tv", data)
            }
        },[state]
    )

    useEffect(() => {
        send_to_tv()
    },[send_to_tv])
    
    useEffect(() => {

        const data = {
            room: state.codeTV,
            salle: state.salle,
            examen: state.exam.code_examen,
            exam: state.exam,
            encours: true
        }
        socket.emit("debut_examen", data)

    },[state])

    const checkCandidantIn = (user, statut) => {
        if(user){

            let candidat = {
                candidat_id: user.id,
                candidat_numero: user.programmation_candidat.candidat.id,
                presence: statut
            }

            if(list.length > 0){
                let existance = list.filter(el => el.candidat_id === user.id)

                if(existance && existance.length > 0){
                    let taba = list.filter(el => el.candidat_id !== user.id)
                    taba = [...taba, candidat]
                    setList(taba)
                }else{

                    let tabs = list
                    tabs = [...tabs, candidat]
                    setList(tabs)
                }

                document.getElementById("show-modal").classList.remove("is--show");

            }else{
                let tabs = list
                tabs = [...tabs, candidat]
                setList(tabs)
                document.getElementById("show-modal").classList.remove("is--show");
            }
        }else{
            return
        }
    }

    const closeCheckIn = (e) => {
        e.preventDefault()
        if(list.length === state.exam.candidatexamen_set.length){

            const data = {
                room: state.codeTV,
                salle: state.salle,
                examen: state.exam.code_examen,
                finish: true
            }
            socket.emit("checkin", data)

            navigate(links.examTest, {
                state: {
                    exam: state,
                    list
                }
            })
            
        }else{
            setErrors("Oupss!! Veuillez terminer l'appel")
        }
    }

    const removeModal = (id) => {
        document.getElementById(id).classList.remove("is--show");
    }
    useEffect(() => {
        if(!state){
            navigate(links.home)
        }
        dispatch(getMe())
        return () => {
            dispatch(reset())
        }
    },[dispatch, state, navigate])

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
        <MainLayout title={"Deroulement de l'examen"} admin={me}>
            <div className='sigepec-page'>
                <div className='sigepec-page-header'>
                    {/* <h1>📖</h1> */}
                    <div className='sigepec-page-createSteps'>
                        <strong className='active'>1. Check In</strong>  - <span>2. Composition</span>
                    </div>
                    <h2>Check-In</h2>
                    <p>Code de l'examen: <strong>{state.exam.code_examen}</strong></p>
                </div>
                <div className='sigepec-page-content'>
                    <form className="sigepec-page-form" onSubmit={closeCheckIn}>
                        <div className='sigepec-page-form__actions special'>
                            <div className='sigepec-page-form__action'>
                                {
                                    state && state.exam.candidatexamen_set && list.length === state.exam.candidatexamen_set.length ? (
                                        <FormButton type={"submit"} mStyle={"primary"}>
                                            Terminer l'appel
                                        </FormButton>
                                    ) : (
                                        <button type={"button"} className={`sigepec-button sigepec-button--disable`}>
                                        { "Terminer l'appel"} 
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        {
                            errors && (
                                <NoticeForm status={"danger"} Icon={DangerIcon} typo={true} title={"Oupss!!"}>
                                    {errors}
                                </NoticeForm>
                            )
                        }
                            
                        <div className='sigepec-page-form__table sigepec-page-form-table'>
                            <strong>Liste des candidats</strong>
                            <div className='sigepec-h-bar'></div>
                            {
                                state && state.exam.candidatexamen_set && state.exam.candidatexamen_set.length > 0 ? (
                                    (
                                        state.exam.candidatexamen_set.map((candidat, index) => (
                                            <div className='sigepec-page-form-table__row' key={index}>
                                                <div className='sigepec-page-form-table__col col-1'>
                                                    <strong>{candidat.programmation_candidat.candidat.id}</strong>
                                                </div>
                                                <div className='sigepec-page-form-table__col col-auto'>
                                                    <div className='sigepec-page-form-table__item'>
                                                        <div className='sigepec-page-form-table__avatar'>
                                                            {
                                                                candidat.programmation_candidat.candidat.dossier.fichiers.filter(el => el.type_de_fichier === "Photo d'identité")[0] ? (
                                                                    <img src={URLIMAGE+candidat.programmation_candidat.candidat.dossier.fichiers.filter(el => el.type_de_fichier === "Photo d'identité")[0].url_fichier} alt="avatar" />
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
                                                        list.length > 0 && list.filter(el => el.candidat_id === candidat.id).length > 0? (

                                                            list.filter(el => el.candidat_id === candidat.id)[0].presence ? (

                                                                <span className='sigepec-chip sigepec-chip--success'>
                                                                    Présent
                                                                </span>
                                                            ) : (

                                                                <span className='sigepec-chip sigepec-chip--danger'>
                                                                    Absent
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className='sigepec-chip'>
                                                                -
                                                            </span>
                                                        )
                                                    }
                                                    
                                                </div>
                                                <div className='sigepec-page-form-table__col col-actions'>
                                                    <button type='button' className='sigepec-button-icon sigepec-button-icon--normal' onClick={() => showModal("show-modal", candidat)} >
                                                        <EyeIcon/> <span>Editer</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                    ) : (
                                        <strong>Aucun candidat programmé</strong>
                                    )
                            }
                        </div>
                    </form>
                </div>

                <div className='sigepec-modal' id='show-modal'>
                    <div className='sigepec-modal__container'>
                        <button type='button' className='sigepec-modal__button' onClick={() => {
                            removeModal("show-modal")
                        }}>
                            <CancelIcon/>
                        </button>
                        <div className='sigepec-modal__header'>
                            <h2>{`Informations candidat `}</h2>
                        </div>
                        {
                            user && (
                                <>
                                <div className='sigepec-modal__body'>
                                    <div className='sigepec-modal__user sigepec-modal-user'>
                                        <div className='sigepec-modal-user__image'>
                                        {
                                            user.programmation_candidat.candidat.dossier.fichiers.filter(el => el.type_de_fichier === "Photo d'identité")[0] ? (
                                                <img src={URLIMAGE+user.programmation_candidat.candidat.dossier.fichiers.filter(el => el.type_de_fichier === "Photo d'identité")[0].url_fichier} alt="avatar" />
                                            ) : (
                                                <UserIcon/>
                                            )
                                        }
                                        </div>
                                        <div className='sigepec-modal-user__info'>
                                            <p>Numero: <strong> {user.programmation_candidat.candidat.id}</strong></p> <br />
                                            <span>{user.programmation_candidat.candidat.dossier.numero_dossier} </span><br />
                                            <strong>{user.programmation_candidat.candidat.dossier.info_id.nom} {user.programmation_candidat.candidat.dossier.info_id.nom_de_jeune_fille ? ` née ${user.programmation_candidat.candidat.dossier.info_id.nom_de_jeune_fille}` : ""} {" "+user.programmation_candidat.candidat.dossier.info_id.prenom}</strong> <br />
                                            <span>Auto Ecole: {user.programmation_candidat.candidat.dossier.auto_ecole.nom_autoecole}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='sigepec-modal__footer sigepec-modal-footer'>
                                    <div className='sigepec-modal-footer__action'>
                                        <button type='button' className='sigepec-button sigepec-button--secondary' onClick={() => checkCandidantIn(user, false)}>
                                           Absent
                                        </button>
                                    </div>
                                    <div className='sigepec-modal-footer__action'>
                                        <button type='button' className='sigepec-button sigepec-button--success' onClick={() => checkCandidantIn(user, true)}>
                                            Présent
                                        </button>
                                    </div>
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

export default Appel;
