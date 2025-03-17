import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token) {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        name: decoded.username,
        email: decoded.email,
        password: decoded.password,
        token,
        refreshToken,
      });
    }
  }, []);

  const login = (username, email, password, token, refreshToken) => {
    const decoded = jwtDecode(token);
    console.log("username", username)
    setUser({
      id: decoded.id,
      name: username,
      email,
      password,
      token,
      refreshToken,
    });
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};