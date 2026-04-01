/**
 * @file Header.tsx
 * @description Application header with navigation.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppRoutes, type AppRoute } from '../constants/AppRoutes';
import { CONFIG } from '../constants/Config';
import { capFirstLetter } from '../helpers/strings';

/**
 * Header component for the application.
 */
export const Header: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-3xl px-4 py-4 pt-6 transition-[background-color,box-shadow] duration-500 ${
      scrolled
        ? 'bg-background/95 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-background/80 shadow-none'
    }`}>
      <div className="flex justify-between items-center max-w-lg mx-auto w-full">
        <h1 className="text-base font-semibold tracking-[0.1em] text-primary-container uppercase">
          {CONFIG.APP_NAME}
        </h1>
        <nav className="flex gap-1">
          {
            Object.keys(AppRoutes).map((key) => {
              const route = AppRoutes[key as keyof typeof AppRoutes] as AppRoute;
              const label = capFirstLetter(key.toLocaleLowerCase());
              return (
                <NavLink
                  className={({ isActive }) => `btn-ghost px-3 py-1.5 ${isActive ? 'text-primary-container drop-shadow-[0_0_8px_rgba(255,193,7,0.5)]' : ''}`}
                  key={key}
                  to={route}
                >
                  {label}
                </NavLink>
              )
            })
          }
        </nav>
      </div>
    </header>
  );
};

