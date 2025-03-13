import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './../assets/logo.png';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ name: decoded.username });
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("authToken");
            }
        }
    }, []);

    const onLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("authToken");
            setUser(null);
            navigate("/");
        }
    };

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