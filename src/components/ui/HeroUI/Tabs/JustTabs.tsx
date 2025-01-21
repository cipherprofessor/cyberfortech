import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

export default function HeroUIJustTabs() {
  const [selected, setSelected] = React.useState("photos");

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key.toString())}
      >
        <Tab key="photos" title="Photos">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="Table" title="Table">
          <Card>
            <CardBody>
              Just Table here with some data and some more data and some more data 
            </CardBody>
          </Card>
        </Tab>
        <Tab key="Key" title="Key">
          <Card>
            <CardBody>
              Here is the key to the data and the data is here and the data is here
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
