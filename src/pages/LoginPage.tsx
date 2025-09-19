
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const AppLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WellTrack Logo">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 11C12.5523 11 13 10.5523 13 10V4.46484C15.9328 4.96544 18 7.58525 18 10.6667V11H20V10.6667C20 6.83787 17.1621 3.75 13.5 3.05556V2C13.5 1.44772 13.0523 1 12.5 1H11.5C10.9477 1 10.5 1.44772 10.5 2V3.05556C6.83787 3.75 4 6.83787 4 10.6667V11H6V10.6667C6 7.58525 8.06717 4.96544 11 4.46484V10C11 10.5523 11.4477 11 12 11ZM17 21C17 18.2386 14.7614 16 12 16C9.23858 16 7 18.2386 7 21C7 23.7614 9.23858 26 12 26C14.7614 26 17 23.7614 17 21ZM11.7071 22.7071L15.2929 19.1213L13.8787 17.7071L11.0001 20.5858L9.29289 18.8787L7.87868 20.2929L11.0001 23.4142L11.7071 22.7071Z" transform="translate(0, -2)"/>
  </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md text-center z-10">
        <div className="flex justify-center items-center mb-6">
            <AppLogoIcon className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-text-primary mb-2 animate-fade-in-up">Welcome to WellTrack</h1>
        <p className="text-lg text-text-secondary mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>Your personal AI-powered health assistant.</p>
        <div className="bg-card backdrop-blur-xl border border-border-color p-8 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Sign In</h2>
          <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out text-text-primary placeholder:text-gray-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-background/50 border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out text-text-primary placeholder:text-gray-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/50 shadow-lg shadow-primary/20"
            >
              Sign In
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-500 mt-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            &copy; {new Date().getFullYear()} WellTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
