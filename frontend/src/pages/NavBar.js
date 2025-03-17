import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './../assets/logo.png';
import { useUser } from '../contexts/UserContexts'

const Navbar = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

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
                <div className="flex items-center">
                    <a href="https://marvellinus-vincent-portfolio.onrender.com" target="_blank" rel="noopener noreferrer">
                        <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
                    </a>
                    <Link to="/">
                        <span className="text-black text-lg font-bold">Rate My University Life</span>
                    </Link>
                </div>
                <div>
                    {user ? (
                        <>
                            <span className="text-black mr-4">{user.name}</span>
                            <button onClick={onLogout} className="text-black">Logout</button>
                        </>
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