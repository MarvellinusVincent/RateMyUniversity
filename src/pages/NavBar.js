import React from 'react';
import { Link } from 'react-router-dom';
import logo from "./../assets/logo.png";

const Navbar = ({ user, onLogout }) => {
    return (
        <nav style={{ backgroundColor: '#f8f9fa' }} className="p-4">
            <div className="flex justify-between items-center px-4">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
                    <span className="text-black text-lg font-bold">Rate My University Life</span>
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
