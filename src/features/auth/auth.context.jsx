import { createContext, useState, useEffect } from "react";
import { getMe, logout as apiLogout } from "../auth/services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [isAppStarting, setIsAppStarting] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsAppStarting(false);
      }
    };

    checkUserAuth();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        handleLogout,
        getMe,
      }}
    >
      {!isAppStarting ? children : null}
    </AuthContext.Provider>
  );
};
