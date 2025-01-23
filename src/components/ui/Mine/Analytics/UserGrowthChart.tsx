import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function UserGrowthChart() {
 const data = [
   { month: 'Jan', students: 120, instructors: 8 },
   { month: 'Feb', students: 150, instructors: 10 },
   // ... more data
 ];

 return (
   <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
     <h2 className="text-lg font-semibold mb-4">User Growth</h2>
     <div className="h-[300px]">
       <ResponsiveContainer width="100%" height="100%">
         <LineChart data={data}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="month" />
           <YAxis />
           <Tooltip />
           <Legend />
           <Line type="monotone" dataKey="students" stroke="#8884d8" />
           <Line type="monotone" dataKey="instructors" stroke="#82ca9d" />
         </LineChart>
       </ResponsiveContainer>
     </div>
   </div>
 );
}