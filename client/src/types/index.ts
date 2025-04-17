
// User types
export type UserRole = "admin" | "user";

export interface User {
  id: number;
  _id?: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  sickLeaveBalance: number;
  paidLeaveBalance: number;
  exceptionBalance: number;
}
export type Users = User[];
// Leave types
export type LeaveType = "sick" | "paid" | "exception";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface Leave {
  id: number;
  userId: number;
  _id?:number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason?: string;
  comment?: string;
  daysCount: number;
  requestDate: string;
  responseDate?: string;
  hrComment?: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  allUsers: Users | null;
  fetchAllUsers: () => Promise<void>;
}

// Leave balance chart data
export interface BalanceChartData {
  name: string;
  value: number;
  color: string;
}
