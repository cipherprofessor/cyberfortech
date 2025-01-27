"use client";
import { CourseEnrollmentChart } from "./CourseEnrollmentChart";
import { GeographicDistribution } from "./GeographicDistribution";
import { RevenueChart } from "./RevenueChart";
import { StudentProgressChart } from "./StudentProgressChart";
import { TopCoursesTable } from "./TopCoursesTable";
import UserGrowthDashboard from "./UserGrowthDashboard";


export function AnalyticsDashboard() {
    return (
      <div className="space-y-6 p-6">
       <UserGrowthDashboard />
        <div className="grid grid-cols-2 gap-6">
          <CourseEnrollmentChart />
          <RevenueChart />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <TopCoursesTable />
          <StudentProgressChart /> 
          {/* <GeographicDistribution /> */}
        </div>
      </div>
    );
   }