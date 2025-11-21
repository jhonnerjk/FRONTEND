import React, { createContext, useState, useContext, useEffect} from "react";    
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            try{
                const decoded = jwtDecode(token);
                const roles = decoded.roles || (decoded.role ? [decoded.role] : ['docente']);
                const primaryRole = roles.includes('admin') ? 'admin' : roles.includes('gestor') ? 'gestor' : roles[0];
                setUser({ id: decoded.userId, role: primaryRole, roles: roles });
            } catch (error) {
                console.error("Token invalido", error);
                localStorage.removeItem('token');
                setToken(null);
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        const decoded = jwtDecode(newToken);
        const roles = decoded.roles || (decoded.role ? [decoded.role] : ['docente']);
        const primaryRole = roles.includes('admin') ? 'admin' : roles.includes('gestor') ? 'gestor' : roles[0];
        setUser({ id: decoded.userId, role: primaryRole, roles: roles });
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
