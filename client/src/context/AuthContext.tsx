import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType, User } from "@/types";
import { users } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  fetchUser: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/auth");
      console.log(data);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user from DB:", error);
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const { user } = response.data;

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.email}!`,
      });

      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      toast({
        title: "Login failed",
        description: error.response?.data?.msg || "Invalid email or password",
        variant: "destructive",
      });

      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Auth context value
  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
