import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const AppLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WellTrack Logo">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 11C12.5523 11 13 10.5523 13 10V4.46484C15.9328 4.96544 18 7.58525 18 10.6667V11H20V10.6667C20 6.83787 17.1621 3.75 13.5 3.05556V2C13.5 1.44772 13.0523 1 12.5 1H11.5C10.9477 1 10.5 1.44772 10.5 2V3.05556C6.83787 3.75 4 6.83787 4 10.6667V11H6V10.6667C6 7.58525 8.06717 4.96544 11 4.46484V10C11 10.5523 11.4477 11 12 11ZM17 21C17 18.2386 14.7614 16 12 16C9.23858 16 7 18.2386 7 21C7 23.7614 9.23858 26 12 26C14.7614 26 17 23.7614 17 21ZM11.7071 22.7071L15.2929 19.1213L13.8787 17.7071L11.0001 20.5858L9.29289 18.8787L7.87868 20.2929L11.0001 23.4142L11.7071 22.7071Z" transform="translate(0, -2)"/>
  </svg>
);


const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-secondary hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 text-white">
                <AppLogoIcon className="h-9 w-9 text-primary" />
                <span className="font-bold text-2xl tracking-tight">WellTrack</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavLink to="/symptom-checker" className={navLinkClass}>Symptom Checker</NavLink>
                <NavLink to="/nearby-services" className={navLinkClass}>Nearby Services</NavLink>
                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                <button onClick={onLogout} className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-text-secondary hover:bg-secondary hover:text-white transition-colors">Logout</button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-secondary inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/symptom-checker" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Symptom Checker</NavLink>
              <NavLink to="/nearby-services" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Nearby Services</NavLink>
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 rounded-full text-sm font-semibold text-text-secondary hover:bg-secondary hover:text-white transition-colors">Logout</button>
            </div>
          </div>
        )}
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;