// src/pages/forum/index.tsx
"use client"

import { ForumCategories } from "@/components/ForumCategories/ForumCategories";
import { ForumManagement } from "@/components/ForumCategories/ForumManagement/ForumManagement";
import { ForumTopicTable } from "@/components/ForumCategories/ForumTopics/ForumTopicsTable";



const mockCategories = [
  {
    id: 1,
    name: "General Discussion",
    description: "General topics and discussions",
    totalTopics: 156,
    totalPosts: 1234,
    icon: "💬",
    subCategories: [
      { id: 1, name: "Introductions" },
      { id: 2, name: "Announcements" }
    ]
  },
  {
    id: 2,
    name: "Technical Support",
    description: "Get help with technical issues",
    totalTopics: 89,
    totalPosts: 567,
    icon: "🔧",
    subCategories: [
      { id: 3, name: "Installation Help" },
      { id: 4, name: "Troubleshooting" }
    ]
  }
];

export default function ForumPage() {
  return (
    <div className="container mx-auto p-4">
      {/* <ForumCategories categories={mockCategories} /> */}
      {/* <ForumManagement /> */}
      <ForumTopicTable />
    </div>
  );
}



// src/pages/forum/index.tsx
// "use client"

// import { ForumCategories } from "@/components/ForumCategories/ForumCategories";
// import { ForumStats } from "@/components/ForumCategories/ForumStats/ForumStats";



// const mockCategories = [
//   {
//     id: 1,
//     name: "General Discussion",
//     description: "General topics and discussions",
//     totalTopics: 156,
//     totalPosts: 1234,
//     icon: "💬",
//     subCategories: [
//       { id: 1, name: "Introductions" },
//       { id: 2, name: "Announcements" }
//     ]
//   }
// ];

// export default function ForumPage() {
//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="md:col-span-2">
//           <ForumCategories categories={mockCategories} />
//         </div>
//         <div>
//           <ForumStats />
//         </div>
//       </div>
//     </div>
//   );
// }