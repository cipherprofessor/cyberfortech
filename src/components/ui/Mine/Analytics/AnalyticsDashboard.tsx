export function AnalyticsDashboard() {
    return (
      <div className="space-y-6 p-6">
        <UserGrowthChart />
        <div className="grid grid-cols-2 gap-6">
          <CourseEnrollmentChart />
          <RevenueChart />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <TopCoursesTable />
          <StudentProgressChart /> 
          <GeographicDistribution />
        </div>
      </div>
    );
   }