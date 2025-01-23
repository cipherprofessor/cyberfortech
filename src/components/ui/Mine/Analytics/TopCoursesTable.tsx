export function TopCoursesTable() {
    const courses = [
      { 
        title: 'Advanced Penetration Testing',
        students: 234,
        revenue: 12340,
        rating: 4.8
      },
      // ... more courses
    ];
   
    return (
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Top Performing Courses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4">Course</th>
                <th className="text-right pb-4">Students</th>
                <th className="text-right pb-4">Revenue</th>
                <th className="text-right pb-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3">{course.title}</td>
                  <td className="text-right">{course.students}</td>
                  <td className="text-right">${course.revenue}</td>
                  <td className="text-right">{course.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
   }