import React from 'react';
import { NavLink } from 'react-router-dom';

const SpecialMenu = ({title,here = "", tabs}) => {
    return (
        <div className='sigepec-page-menu'>
            <div className='sigepec-page-menu__container'>
                <h2>{title}</h2>
                <nav className='sigepec-page-menu__navigation sigepec-page-menu-navigation'>
                    {
                        tabs.map((tab, index) => (
                            <div className='sigepec-page-menu-navigation__container' key={index}>
                                <span className='sigepec-page-menu-navigation__subtitle'>{tab.subtitle}</span>
                                <ul className='sigepec-page-menu-navigation__list'>
                                    {
                                        tab.links.map((link, key) => (
                                            <li className='sigepec-page-menu-navigation__item' key={key}>
                                                <NavLink to={link.link} className={`${here === link.here ? "active" : ""}`} end>
                                                    {link.name}
                                                </NavLink>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </nav>
            </div>
        </div>
    );
};

export default SpecialMenu;