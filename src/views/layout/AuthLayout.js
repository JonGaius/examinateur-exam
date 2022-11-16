import React from 'react';
import logo from '../../assets/images/logo.png';
import { titlePage } from '../../utils/sharedFunction';

const AuthLayout = ({title, subtitle, image, children}) => {
    titlePage(title)
    return (
        <>
            <section className='sigepec-auth__image sigepec-auth-image'>
                <img src={image} alt="auth" />
            </section>
            <section className='sigepec-auth__formContainer sigepec-auth-formContainer'>
                <div className='sigepec-auth-formContainer__container'>
                    <header className='sigepec-auth-formContainer__header sigepec-auth-formContainer-header'>
                        <div className='sigepec-auth-formContainer__logo'>
                            <img src={logo} alt="dgttm" />
                        </div>
                        <strong>SIGEPeC - Examinateur</strong>
                        <br />
                        <p>
                            Système Intégré de Gestion des Permis de Conduire
                        </p>
                        <h1>{title}</h1>
                        <span>{subtitle}</span>
                    </header>

                    <main className='sigepec-auth-formContainer__main' role={"main"}>
                        {children}
                    </main>
                </div>
            </section>
        </>
    );
};

export default AuthLayout;