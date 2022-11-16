import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from './constant';

const WebRoutes = () => {
    return (
        <Routes>
            {
                routes && routes.map(({path, Component, exact}, index) => (
                    <Route exact={exact} path={path} element={<Component/>} key={index}/>
                ))
            }
        </Routes>
    );
};

export default WebRoutes;