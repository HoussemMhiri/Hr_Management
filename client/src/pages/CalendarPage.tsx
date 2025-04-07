import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leaves, users } from "@/lib/mockData";
import { Leave, User } from "@/types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  // Format leaves as calendar events
  useEffect(() => {
    // Filter leaves based on user role
    let filteredLeaves: Leave[] = [];

    if (user?.role === "admin") {
      filteredLeaves = leaves.filter((leave) => leave.status === "approved");
    } else {
      filteredLeaves = leaves.filter((leave) => leave.userId === user?.id);
    }

    // Convert leaves to calendar events
    const calendarEvents = filteredLeaves.map((leave) => {
      // Get user name for the leave
      const leaveUser = users.find((u) => u.id === leave.userId) as User;
      const userName = leaveUser ? leaveUser.name : `User ${leave.userId}`;

      // Determine event color based on leave type
      let color;
      switch (leave.type) {
        case "paid":
          color = "#14b8a6"; // Primary color for paid leaves
          break;
        case "sick":
          color = "#6366f1"; // Purple for sick leaves
          break;
        case "exception":
          color = "#f59e0b"; // Amber for exception leaves
          break;
        default:
          color = "#cbd5e1"; // Default gray
      }

      // Add opacity based on status
      if (leave.status === "pending") {
        color = color + "80"; // 50% opacity
      }

      return {
        id: leave.id,
        title:
          user?.role === "admin" ? `${userName} - ${leave.type}` : leave.type,
        start: leave.startDate,
        end: leave.endDate,
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        textColor: "#ffffff",
        extendedProps: {
          status: leave.status,
          type: leave.type,
          reason: leave.reason,
          userId: leave.userId,
        },
      };
    });

    setEvents(calendarEvents);
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leave Calendar</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {user?.role === "admin"
              ? "Team Leave Schedule"
              : "Your Leave Schedule"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
              }}
              eventClick={(info) => {
                const { extendedProps } = info.event;
                alert(`
                  Type: ${extendedProps.type}
                  Status: ${extendedProps.status}
                  Reason: ${extendedProps.reason || "No reason provided"}
                `);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <span className="mr-2 h-3 w-3 rounded-full bg-[#14b8a6]"></span>
          <span className="text-sm">Paid Leave</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 h-3 w-3 rounded-full bg-[#6366f1]"></span>
          <span className="text-sm">Sick Leave</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 h-3 w-3 rounded-full bg-[#f59e0b]"></span>
          <span className="text-sm">Exception</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 h-3 w-3 rounded-full bg-[#cbd5e1]"></span>
          <span className="text-sm">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
