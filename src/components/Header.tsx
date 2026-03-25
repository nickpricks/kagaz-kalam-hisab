/**
 * @file Header.tsx
 * @description Application header with navigation.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppRoutes, type AppRoute } from '../constants/AppRoutes';
import { CONFIG } from '../constants/Config';
import { capFirstLetter } from '../helpers/stings';

/**
 * Header component for the application.
 */
export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>{CONFIG.APP_NAME}</h1>
        <nav>
          {
            Object.keys(AppRoutes).map((key) => {
              const route = AppRoutes[key as keyof typeof AppRoutes] as AppRoute;
              const label = capFirstLetter(key.toLocaleLowerCase());
              return (
                <NavLink
                  className={({ isActive }) => isActive ? 'active' : ''}
                  key={key}
                  to={route}
                >
                  {
                    label
                  }
                </NavLink>
              )
            })
          }
        </nav>
      </div>
    </header>
  );
};

