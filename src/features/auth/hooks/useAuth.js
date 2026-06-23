import { useContext } from "react";
import { login, register } from "../services/auth.api";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }


  const { user, setUser, loading, setLoading, handleLogout } = context;

  async function handleRegister({ username, email, password }) {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin({ username, email, password }) {
    setLoading(true);
    try {
      const data = await login({ username, email, password });
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout, 
  };
};