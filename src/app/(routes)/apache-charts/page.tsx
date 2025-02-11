"use client";

import ChartsDashboardTab1 from "./Tab1";
import ChartsDashboardTab2 from "./Tab2";
import ChartsDashboardTab3 from "./Tabs3";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center m-20  p-20 mb-30">
        <ChartsDashboardTab1 />
        <ChartsDashboardTab2 />
        <ChartsDashboardTab3 />
      </div>
    </>
  );
}
