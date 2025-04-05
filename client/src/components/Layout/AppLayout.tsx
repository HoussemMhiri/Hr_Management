
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut, Menu, User, Calendar, ClipboardList, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <ClipboardList className="h-5 w-5" />,
      visible: true,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      visible: true,
    },
    {
      name: "Users",
      path: "/users",
      icon: <User className="h-5 w-5" />,
      visible: user?.role === "admin",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      visible: user?.role === "admin",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-sidebar transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "shadow-lg" : ""
        )}
      >
        <div>
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-sidebar-foreground">Leave Manager</h1>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <nav className="mt-6 flex-1 space-y-1 px-4">
            {navigationItems
              .filter((item) => item.visible)
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center rounded-md px-4 py-3 text-sm font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
          </nav>
        </div>
        
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-sidebar-foreground hover:text-sidebar-foreground/70"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(!isMobile && !isSidebarOpen ? "visible" : isMobile ? "visible" : "invisible")}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-4">
              {/* Additional header elements could go here */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="container mx-auto py-6 px-4">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
