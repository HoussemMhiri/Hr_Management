// context/LeaveContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Leave } from "@/types";

interface LeaveContextType {
  leaves: Leave[];
  fetchLeaves: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider = ({ children }: { children: React.ReactNode }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/leave");
      console.log(data);
      setLeaves(data.leaves);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch leaves:", err);
      setError("Failed to fetch leaves");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <LeaveContext.Provider value={{ leaves, fetchLeaves, isLoading, error }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = (): LeaveContextType => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error("useLeave must be used within a LeaveProvider");
  }
  return context;
};
