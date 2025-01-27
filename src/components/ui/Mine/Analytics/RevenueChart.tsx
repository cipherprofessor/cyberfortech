"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueChart() {
 const data = [
   { month: 'Jan', revenue: 15000, expenses: 5000 },
   { month: 'Feb', revenue: 18000, expenses: 5500 },
   { month: 'Mar', revenue: 22000, expenses: 6000 }
 ];

 return (
   <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
     <div className="flex justify-between mb-6">
       <h2 className="text-lg font-semibold">Revenue Overview</h2>
       <div className="flex items-center gap-4">
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-blue-500 rounded-full"/>
           <span className="text-sm">Revenue</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-red-500 rounded-full"/>
           <span className="text-sm">Expenses</span>
         </div>
       </div>
     </div>
     <ResponsiveContainer width="100%" height={300}>
       <AreaChart data={data}>
         <XAxis dataKey="month"/>
         <YAxis/>
         <Tooltip/>
         <Area 
           type="monotone" 
           dataKey="revenue" 
           stackId="1"
           stroke="#3b82f6"
           fill="#3b82f6"
           fillOpacity={0.5}
         />
         <Area 
           type="monotone" 
           dataKey="expenses" 
           stackId="1"
           stroke="#ef4444"
           fill="#ef4444"
           fillOpacity={0.5}
         />
       </AreaChart>
     </ResponsiveContainer>
   </div>
 );
}
