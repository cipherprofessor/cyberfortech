"use client";
export function StudentProgressChart() {
    const data = [
      { name: 'Completed', value: 540, color: '#22c55e' },
      { name: 'In Progress', value: 320, color: '#3b82f6' },
      { name: 'Not Started', value: 140, color: '#94a3b8' }
    ];
  
    return (
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span>{item.name}</span>
                <span>{item.value} students</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div 
                  className="h-full rounded" 
                  style={{
                    width: `${(item.value / 1000) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  