//src/app/(routes)/apache-charts/Tab1.tsx
"use client";
import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

export default function ChartsDashboardTab1() {
  const [selected, setSelected] = React.useState("area");

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Chart Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="chart_name" title="Chart Name">
          <Card>
            <CardBody>Mohsin</CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
