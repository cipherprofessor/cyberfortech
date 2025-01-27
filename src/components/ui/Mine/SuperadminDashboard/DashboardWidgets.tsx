"use client";
import { Users, BookOpen, DollarSign, UserPlus } from "lucide-react";
import { StatsCard } from "./StatsCard";

export function DashboardWidgets() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users"
          value="1,234"
          trend="+12%"
          icon={<Users />}
        />
        <StatsCard 
          title="Active Courses"
          value="45"
          trend="+5%"
          icon={<BookOpen />}
        />
        <StatsCard 
          title="Revenue"
          value="$12,345"
          trend="+8%"
          icon={<DollarSign />}
        />
        <StatsCard 
          title="Enrollments"
          value="890"
          trend="+15%"
          icon={<UserPlus />}
        />
      </div>
    );
   }