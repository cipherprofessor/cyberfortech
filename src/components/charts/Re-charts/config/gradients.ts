// src/components/charts/config/gradients.ts
// export const chartGradients = {
//     primary: [
//       { offset: '0%', color: '#3B82F6', opacity: 0.8 },
//       { offset: '100%', color: '#1D4ED8', opacity: 0.3 }
//     ],
//     success: [
//       { offset: '0%', color: '#10B981', opacity: 0.8 },
//       { offset: '100%', color: '#047857', opacity: 0.3 }
//     ],
//     // Add more gradients
//   };


export const chartGradients: { [key: string]: { offset: string; color: string; opacity: number; }[] } = {

    primary: [
  
      { offset: '0%', color: '#4f46e5', opacity: 1 },
  
      { offset: '100%', color: '#3b82f6', opacity: 0.5 }
  
    ],
  
    success: [
  
      { offset: '0%', color: '#10b981', opacity: 1 },
  
      { offset: '100%', color: '#6ee7b7', opacity: 0.5 }
  
    ]
};
  
 