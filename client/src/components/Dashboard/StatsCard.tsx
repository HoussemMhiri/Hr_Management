
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
