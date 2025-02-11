"use client";
import React from "react";
import {Alert, Button} from "@heroui/react";

interface PassAlertProps {

  message: string;

}



const PassAlert: React.FC<PassAlertProps> = ({ message }) => {

  return (

    <div className="alert alert-success">

      <p>{message}</p>

    </div>

  );

};



export default PassAlert;

// export default function PassAlert() {
//   const [isVisible, setIsVisible] = React.useState(true);

//   const title = "Pass Created Successfully";
//   const description =
//     "You have successfully done the job";

//   return (
//     <div className="flex flex-col gap-4">
//       {isVisible ? (
//         <Alert
//           color="success"
//           description={description}
//           isVisible={isVisible}
//           title={title}
//           variant="faded"
//           onClose={() => setIsVisible(false)}
//         />
//       ) : (
//         <></>
//       )}
//     </div>
//   );
// }
