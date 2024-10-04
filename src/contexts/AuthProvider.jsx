import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth"; // Import signOut correctly
import { toast } from "react-toastify";
import { auth } from "../firebase"; // Ensure this import is correct

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth); // Pass 'auth' here
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user); // Simplify the logic for setting authentication state
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth); // Use 'auth' here
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
