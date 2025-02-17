import { GenderStats, TimeRange } from "./StudentOverview";

// mockData.ts
export const mockStudentStats: Record<TimeRange, GenderStats> = {
    week: {
      male: {
        count: 567,
        change: 2.15
      },
      female: {
        count: 208,
        change: -2.15
      },
      others: {
        count: 243,
        change: 1.8
      }
    },
    month: {
      male: {
        count: 2345,
        change: 1.8
      },
      female: {
        count: 876,
        change: 3.2
      },
      others: {
        count: 156,
        change: 2.5
      }
    },
    year: {
      male: {
        count: 28976,
        change: 5.4
      },
      female: {
        count: 15432,
        change: 4.8
      },
      others: {
        count: 2580,
        change: 6.2
      }
    }
  };