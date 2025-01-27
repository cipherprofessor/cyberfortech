"use client";

type StatsCardProps = {
    title: string;
    value: string;
    trend: string;
    icon: React.ReactNode;
   };
   
   export function StatsCard({ title, value, trend, icon }: StatsCardProps) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">{title}</span>
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold">{value}</h3>
          <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
      </div>
    );
   }