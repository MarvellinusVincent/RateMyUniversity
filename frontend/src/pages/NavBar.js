import { useState, forwardRef, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from './../assets/logo.png';
import UseClickOutside from '../contexts/UseClickOutside';

const Navbar = forwardRef((props, ref) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    UseClickOutside(dropdownRef, () => {
      setIsDropdownOpen(false);
    });

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setShowLogoutModal(true);
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const handleLogoutConfirm = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <>
            <nav 
                ref={ref}
                className="bg-white shadow-sm fixed top-0 left-0 w-full z-50"
                style={{
                  paddingTop: 'env(safe-area-inset-top)',
                  paddingLeft: 'env(safe-area-inset-left)',
                  paddingRight: 'env(safe-area-inset-right)'
                }}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center flex-shrink-0 min-w-0">
                            <img 
                                src={logo} 
                                alt="Logo" 
                                className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4 flex-shrink-0" 
                            />
                            <Link 
                                to="/" 
                                className="text-base sm:text-lg md:text-xl font-medium text-gray-900 hover:text-gray-700 truncate"
                            >
                                <span className="hidden sm:inline">Rate My University</span>
                                <span className="sm:hidden">RMU</span>
                            </Link>
                        </div>

                        <div className="relative ml-2 sm:ml-4 flex-shrink-0">
                            {isAuthenticated() ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none px-2 py-2 sm:px-3 sm:py-2 rounded-md text-sm sm:text-base font-medium"
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
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
                                            className="absolute right-0 mt-2 w-44 sm:w-48 md:w-56 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
                                            role="menu"
                                        >
                                            <Link 
                                                to="/profile" 
                                                className="block px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link 
                                                to="/savedReviews" 
                                                className="block px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Saved Reviews
                                            </Link>
                                            <button 
                                                onClick={handleLogoutClick}
                                                className="block w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4">
                                    <Link 
                                        to="/login" 
                                        className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/signUp" 
                                        className="bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium hover:bg-blue-700 whitespace-nowrap"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 max-w-md w-full mx-3 sm:mx-4 border border-white/20">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-blue-100 rounded-full">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-2">
                            Logout
                        </h3>
                        
                        <p className="text-gray-600 text-center mb-5 sm:mb-6 text-sm sm:text-base px-2">
                            Are you sure you want to log out? You'll need to sign in again to access your account.
                        </p>
                        
                        <div className="flex gap-2 sm:gap-3 justify-between">
                            <button
                                onClick={handleLogoutCancel}
                                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
                                disabled={isLoggingOut}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                disabled={isLoggingOut}
                                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white"></div>
                                        <span className="hidden sm:inline">Logging out...</span>
                                        <span className="sm:hidden">...</span>
                                    </>
                                ) : (
                                    "Logout"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

Navbar.displayName = 'Navbar';
export default Navbar;