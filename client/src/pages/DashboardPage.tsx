import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { leaves } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import LeaveBalanceCard from "@/components/Dashboard/LeaveBalanceCard";
import RecentLeavesCard from "@/components/Dashboard/RecentLeavesCard";
import StatsCard from "@/components/Dashboard/StatsCard";
import LeaveForm from "@/components/Dashboard/LeaveForm";
import { Leave } from "@/types";
import { Calendar, Clock, FileText } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);
  const [userLeaves, setUserLeaves] = useState<Leave[]>(
    leaves.filter((leave) => leave.userId === user?.id)
  );

  // Filter leaves for the current user
  const userPendingLeaves = userLeaves.filter(
    (leave) => leave.status === "pending"
  ).length;

  // Calculate the next leave date
  const getNextLeaveDate = () => {
    const futureLeaves = userLeaves
      .filter(
        (leave) =>
          leave.status === "approved" &&
          differenceInDays(parseISO(leave.startDate), new Date()) > 0
      )
      .sort(
        (a, b) =>
          parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()
      );

    if (futureLeaves.length > 0) {
      return parseISO(futureLeaves[0].startDate);
    }
    return null;
  };

  const nextLeave = getNextLeaveDate();

  // Handle leave form submission
  const handleLeaveSubmit = (leave: Partial<Leave>) => {
    const newLeave: Leave = {
      id: Math.max(0, ...leaves.map((l) => l.id)) + 1,
      userId: user!.id,
      type: leave.type!,
      startDate: leave.startDate!,
      endDate: leave.endDate!,
      status: "pending",
      reason: leave.reason,
      requestDate: new Date().toISOString().split("T")[0],
    };

    setUserLeaves([...userLeaves, newLeave]);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsLeaveFormOpen(true)}>Request Leave</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Pending Requests"
          value={userPendingLeaves}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Leave Balance"
          value={user.paidLeaveBalance}
          description="Paid leaves remaining"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatsCard
          title="Next Leave"
          value={
            nextLeave
              ? nextLeave.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "None scheduled"
          }
          icon={<FileText className="h-5 w-5" />}
        />
      </div>

      {/* Balance and Recent Leaves */}
      <div className="grid gap-6 md:grid-cols-2">
        <LeaveBalanceCard
          sickLeave={user.sickLeaveBalance}
          paidLeave={user.paidLeaveBalance}
          exceptionLeave={user.exceptionBalance}
        />
        <RecentLeavesCard leaves={userLeaves} />
      </div>

      {/* Leave request form */}
      <LeaveForm
        open={isLeaveFormOpen}
        onOpenChange={setIsLeaveFormOpen}
        user={user}
        onSubmit={handleLeaveSubmit}
      />
    </div>
  );
};

export default DashboardPage;
