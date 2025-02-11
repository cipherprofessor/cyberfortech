"use client";
import {Alert, Button} from "@heroui/react";



interface FailAlertProps {

  message: string;

}



export default function FailAlert({ message }: FailAlertProps) {

  return (

    <div className="alert alert-danger">

      <strong>Error!</strong> {message}

    </div>

  );

}

// export default function FailAlert() {
//   return (
//     <div className="flex items-center justify-center w-full">
//       <Alert
//         color="danger"
//         description="Something went wrong. Please try again."
//         endContent={
//           <Button color="danger" size="sm" variant="flat">
//             Reload / Try Again
//           </Button>
//         }
//         title="Failed To Create Pass"
//         variant="faded"
//       />
//     </div>
//   );
// }