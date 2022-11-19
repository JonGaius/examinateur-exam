import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, NavLink, useNavigate} from 'react-router-dom';
// import CandidatIcon from '../../assets/icons/service/CandidatIcon';
// import ConfigIcon from '../../assets/icons/service/ConfigIcon';
// import DossierIcon from '../../assets/icons/service/DossierIcon';
// import EcoleIcon from '../../assets/icons/service/EcoleIcon';
import ExamIcon from '../../assets/icons/service/ExamIcon';
// import ExaminateurIcon from '../../assets/icons/service/ExaminateurIcon';
// import IdCardIcon from '../../assets/icons/service/idCardIcon';
import QuestionIcon from '../../assets/icons/service/QuestionIcon';
// import BellIcon from '../../assets/icons/ui/BellIcon';
import HomeIcon from '../../assets/icons/ui/HomeIcon';
import UserIcon from '../../assets/icons/ui/UserIcon';
import logo from "../../assets/images/logo.png";
import { logout } from '../../features/auth/authSlice';
import { links } from '../../router/constant';
import { titlePage } from '../../utils/sharedFunction';

const NavItem = ({Icon, link, children}) => {
    return (
        <NavLink to={link} className="sigepec-layout-mainNavigation-navigation__item" end>
            <Icon/> <span>{children}</span>
        </NavLink>
    )
}

const MainLayout = ({title, min = false, children, admin = null}) => {
    titlePage(title)
    const navLinks = [
        // {
        //     Icon: DossierIcon,
        //     link: links.dossier,
        //     label: "Dossiers"
        // },
        // {
        //     Icon: IdCardIcon,
        //     link: links.idCard,
        //     label: "IdCards"
        // },
        // {
        //     Icon: CandidatIcon,
        //     link: links.candidats,
        //     label: "Candidats"
        // },
        // {
        //     Icon: EcoleIcon,
        //     link: links.autoecoles,
        //     label: "Auto-Ecoles"
        // },
        // {
        //     Icon: ExaminateurIcon,
        //     link: links.examinateurs,
        //     label: "Examinateurs"
        // },
        // {
        //     Icon: CandidatIcon,
        //     link: links.examIntro,
        //     label: "Composition"
        // },
        {
            Icon: ExamIcon,
            link: links.examens,
            label: "Programmations"
        },
        {
            Icon: QuestionIcon,
            link: links.etats,
            label: "Etats"
        },
        // {
        //     Icon: ConfigIcon,
        //     link: links.configuration,
        //     label: "Configuration"
        // },
    ]
    let navigate = useNavigate();
    const dispatch = useDispatch()
   
    const {user} = useSelector(
        (state) => state.auth
    )
    useEffect(() => {
        if(!user){
            navigate(links.login)
        }
    }, [user, navigate])
    return (
        <>
            <section className={`sigepec-layout__mainNavigation sigepec-layout-mainNavigation is--min`}>
                {/* <button type='button' className='sigepec-layout-mainNavigation__reduce' onClick={() => {
                    document.querySelector(".sigepec-layout-mainNavigation").classList.toggle("is--min");
                    document.querySelector(".sigepec-layout__main").classList.toggle("is--min");
                }}>
                    <div className='sigepec-icon-angle'></div>
                </button> */}
                <div className='sigepec-layout-mainNavigation__container'>
                    <header className='sigepec-layout-mainNavigation__header'>
                        <Link to={links.home}>
                            <img src={logo} alt="dgttm" />
                        </Link>
                    </header>
                    <nav className='sigepec-layout-mainNavigation__navigation sigepec-layout-mainNavigation-navigation'>
                        <NavItem Icon={HomeIcon} link={links.home}>
                            Accueil
                        </NavItem>
                        <div className='sigepec-h-bar'></div>
                        <ul className='sigepec-layout-mainNavigation-navigation__list'>
                            {
                                navLinks.map(({Icon, link, label}, index) => (
                                    <li className='sigepec-layout-mainNavigation-navigation__list--item' key={index}>
                                        <NavItem Icon={Icon} link={link}>
                                            {label}
                                        </NavItem>
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                    <div className='sigepec-layout-mainNavigation__profile sigepec-layout-mainNavigation-profile'>
                        <ul className='sigepec-layout-mainNavigation-profile__list'>
                            {/* <li className='sigepec-layout-mainNavigation-profile__item'>
                                <NavItem Icon={BellIcon} link={links.notification}>
                                    Notification
                                </NavItem>
                            </li> */}
                            <li className='sigepec-layout-mainNavigation-profile__item'>
                                <button type='button' className="sigepec-layout-mainNavigation-navigation__item" onClick={() => {
                                    document.querySelector(".sigepec-layout-mainNavigation-profile__item--modal").classList.toggle("is--active")
                                }}>
                                    <UserIcon/> <span>{admin ? (
                                        <>
                                        {
                                            admin.prenom + " " + admin.nom
                                        }
                                        </>
                                    ) : "John DOEE"}</span>
                                </button>
                                <ul className='sigepec-layout-mainNavigation-profile__item--modal'>
                                    <li>
                                        <NavLink to={links.account} end>
                                            Mon compte
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button type='button' onClick={() => {
                                            dispatch(logout())
                                        }}>Deconnexion</button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <main role={"main"} className={`sigepec-layout__main is--min`}>
                {children}
                <footer className='sigepec-layout__footer'>
                    <p>SIGEPEC Version Pilote/V221101</p>
                    <p>©DGTTM 2022 Tous droits réservés</p>
                    <p>Réalisation IVENTIT/BAMING</p>
                </footer>
            </main>
        </>
    );
};

export default MainLayout;