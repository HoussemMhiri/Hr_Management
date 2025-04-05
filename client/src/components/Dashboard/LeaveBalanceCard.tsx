
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { BalanceChartData } from "@/types";

interface LeaveBalanceCardProps {
  sickLeave: number;
  paidLeave: number;
  exceptionLeave: number;
}

const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  sickLeave,
  paidLeave,
  exceptionLeave,
}) => {
  const data: BalanceChartData[] = [
    { name: "Paid Leave", value: paidLeave, color: "#14b8a6" },
    { name: "Sick Leave", value: sickLeave, color: "#6366f1" },
    { name: "Exception", value: exceptionLeave, color: "#f59e0b" },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leave Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center">
              <span
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-medium">{item.value} days</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
