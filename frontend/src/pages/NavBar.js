import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContexts';
import logo from './../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const onLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            logout();
            navigate("/");
        }
    };

    return (
        <nav style={{ backgroundColor: '#f8f9fa' }} className="fixed top-0 left-0 w-full z-50 p-4">
            <div className="flex justify-between items-center px-4">
                {/* Logo and Website Title */}
                <div className="flex items-center">
                    <a href="https://marvellinus-vincent-portfolio.onrender.com" target="_blank" rel="noopener noreferrer">
                        <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
                    </a>
                    <Link to="/" className="text-black text-lg font-bold">
                        Rate My University Life
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="relative">
                    {user ? (
                        <div className="relative">
                            {/* Dropdown Toggle Button */}
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                className="text-black font-semibold flex items-center"
                            >
                                Account
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button 
                                        onClick={onLogout} 
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-black mr-4">Login</Link>
                            <Link to="/signUp" className="text-black">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
