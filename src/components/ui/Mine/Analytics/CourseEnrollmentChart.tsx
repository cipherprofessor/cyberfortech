export function CourseEnrollmentChart() {
    const data = [
      { course: 'Network Security', count: 245 },
      { course: 'Ethical Hacking', count: 188 },
      { course: 'Cloud Security', count: 156 },
      { course: 'Web Security', count: 142 },
      { course: 'Mobile Security', count: 98 }
    ];
  
    const maxEnrollments = Math.max(...data.map(d => d.count));
  
    return (
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Top Course Enrollments</h2>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{item.course}</span>
                <span>{item.count} students</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div 
                  className="h-full bg-blue-500 rounded"
                  style={{
                    width: `${(item.count / maxEnrollments) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }