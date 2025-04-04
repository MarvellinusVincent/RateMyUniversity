import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from './../assets/logo.png';
import UseClickOutside from '../contexts/UseClickOutside';

const Navbar = forwardRef((props, ref) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navRef = React.useRef(null);
    const dropdownRef = useRef(null);
    const [dimensions, setDimensions] = useState({
      height: 0,
      width: 0
    });

    UseClickOutside(dropdownRef, () => {
      setIsDropdownOpen(false);
    });

    useEffect(() => {
      const updateDimensions = () => {
        if (navRef.current) {
          setDimensions({
            height: navRef.current.offsetHeight,
            width: navRef.current.offsetWidth
          });
        }
      };

      updateDimensions();

      const resizeObserver = new ResizeObserver(updateDimensions);
      if (navRef.current) {
        resizeObserver.observe(navRef.current);
      }

      return () => resizeObserver.disconnect();
    }, []);

    React.useImperativeHandle(ref, () => ({
      getHeight: () => dimensions.height
    }));

    const onLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            logout();
            navigate("/");
        }
    };

    return (
        <nav 
            ref={navRef}
            className="bg-white shadow-sm fixed top-0 left-0 w-full z-50"
            style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <a 
                            href="http://marvellinus-vincent-portfolio.onrender.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <img 
                              src={logo} 
                              alt="Logo" 
                              className="h-8 w-8 sm:h-10 sm:w-10 mr-2" 
                            />
                        </a>
                        <Link 
                            to="/" 
                            className="text-lg sm:text-xl font-medium text-gray-900 whitespace-nowrap hover:text-gray-700"
                        >
                            Rate My University
                        </Link>
                    </div>

                    {/* Conditional rendering based on authentication */}
                    <div className="relative ml-4">
                        {isAuthenticated() ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none px-3 py-2 rounded-md text-sm sm:text-base font-medium"
                                    aria-expanded={isDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="hidden sm:inline">Account</span>
                                    <svg 
                                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
                                        role="menu"
                                    >
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link 
                                            to="/savedReviews" 
                                            className="block px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Saved Reviews
                                        </Link>
                                        <button 
                                            onClick={onLogout} 
                                            className="block w-full text-left px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Link 
                                    to="/login" 
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm sm:text-base font-medium"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signUp" 
                                    className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 whitespace-nowrap"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
});

Navbar.displayName = 'Navbar';
export default Navbar;