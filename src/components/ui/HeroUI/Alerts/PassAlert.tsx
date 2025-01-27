import React from "react";
import {Alert, Button} from "@heroui/react";

export default function PassAlert() {
  const [isVisible, setIsVisible] = React.useState(true);

  const title = "Pass Created Successfully";
  const description =
    "You have successfully done the job";

  return (
    <div className="flex flex-col gap-4">
      {isVisible ? (
        <Alert
          color="success"
          description={description}
          isVisible={isVisible}
          title={title}
          variant="faded"
          onClose={() => setIsVisible(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
